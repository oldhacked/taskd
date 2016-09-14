var secret = process.env.SECRET || require('./.credentials').secret
var jwt = require('jsonwebtoken');

module.exports.jwtAuthenticator = function(req,res,next){
  // 1. Store the value of the 'x-access-token' header
  // in a variable
  var token = req.headers['x-access-token'];
  // 2. If the token is defined...
  if (token) {
    // 3. Use the 'jsonwebtoken' packages verify method
    jwt.verify(token, secret, function(err,decoded){
      // 4. If there is an error, or the decoded token is 
      // not defined respond 401
      if(!decoded || err) {
        res.status(401);
        return res.json({
          success : false,
          message : 'Failed to authenticate token'
        });
      } else {
      // 5. If all goes well, store the decoded JWT in a
      // 'payload' property on the request (in case we need it later)
      // call 'next()' to move to the next middleware function
        req.payload = decoded;
        next();
      }
    })
  } else {
  // 6. If the token was undefined...
    res.status(401)
    res.json({
      success : false,
      message : 'No token provided'
    });
  }
};