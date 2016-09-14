var mongoose = require('mongoose');
var User = mongoose.model('User');
var express = require('express');
var router = express.Router();

//jwt dependancies 
var jwt = require('jsonwebtoken');
var jwtSecret = require('./.credentials.js').secret;
if (process.env.NODE_ENV == 'production'){
  jwtSecret = process.env.SECRET;
}

///////////////SIGN UP//////////////////////

router.post('/signup', function(req, res, next){

  console.log("signup rout hit ");

  var notEmpty = checker.check(req.body.username,req.body.password);

  if(notEmpty){
    User.findOne({'username' : req.body.username}, function(err, user) {
      if (err) {
        console.log('Error in sign up: ' + err);
        res.status(400);
        res.json( {err: 'Error in sign up: ' + err, sign: false});
        return;
      }
      if (user) {
        console.log('User already exists with username: ' + req.body.username);
        res.status(401);
        res.json( {err: 'User already exists with username: ' + req.body.username, sign: false});
        return;
      } else {
        var u = new User({
          username: req.body.username,
          password: req.body.password
        });
        u.save(function(err, result) {
          if (err) {
            console.log('Error in saving user: ' + err);  
            res.json( {err: 'Error in sign up: ' + err, sign: false});
            return;
          }
          console.log('User registration was successful.');    
          res.status(201);
          var token = checker.pass(result);
          var usercred = {sign: true, user: result, token: token};
          res.json(usercred);
          console.log(usercred);
        });
      }
    });
}else{
  res.status(400);
  res.json({err: 'Must provide username or password', sign: false});
}
});




////////////////// LOG IN /////////////////////////


router.post('/login', function(req, res, next){

  var notEmpty = checker.check(req.body.username,req.body.password);

  if(notEmpty){
   User.findOne({'username' : req.body.username}, function(err, user) {
    if (err) {
      console.log('Error in login: ' + err);
      res.status(400);
      res.json( {err: 'Error in login: ' + err, sign: false});
      return;
    }
    if(user){

      user.comparePassword( req.body.password, function(err, isMatch) {
        if (err){
         res.status(400);
         res.json({err : "Error", sign: false});
       } 
       if (isMatch){
         var token = checker.pass(user);
         var usercred = {sign: true, user: user, token: token};
         res.status(201);
         res.json(usercred);
         console.log(usercred);
       }else{
        res.status(400);
        res.json({err : "Incorrect username or password", sign: false});
      }
    });
    }else{
     res.status(400);
     res.json({err : "Incorrect username or password", sign: false});
   }
 });

 }else{
  res.status(400);
  res.json({err: 'Must provide username or password', sign: false});
}

});

////////////// HELPER FUNCTIONS ///////

var checker = {

  check: function(username, password){
    if(!username || !password){
      console.log("no username or password provided")
      return false;
    }else{
      return true;
    }
  },
  pass: function(user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);

    return jwt.sign({
      _id : user._id,
      username : user.username,
      exp : parseInt(expiry.getTime() / 1000)
    }, jwtSecret);
  },

};



module.exports = router;
