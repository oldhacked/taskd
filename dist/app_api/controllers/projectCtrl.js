var mongoose = require('mongoose');
var Project = mongoose.model('Project');

//MAKE NEW PROJECT

module.exports.newProject = function (req, res, next) {
 console.log("newProject rout hit");
   // var dueDate = new Date()  
   // ISODate(req.body.dueDate)
   var p = new Project({
     uid: req.body.uid,
     title: req.body.title,
     client: req.body.client,
     dueDate: req.body.dueDate,
     rate: req.body.rate
 });

   p.save(function (err, project) {
    if (err) return next(err);
    res.status(201);
    res.json(project);
    console.log("project added");
});
};


//GET ALL PROJECTS
module.exports.getAllProjects = function (req, res, next) {
    console.log("get all projects rout hit: req.params.uid: " +  req.params.uid);
    Project.find({uid: req.params.uid}, function (err, projects) {
        if (err) return next(err);
        res.status(201);
        res.json(projects);
    });
};   

//GET ALL PROJECT STUBS
module.exports.getAllProjectStubs = function (req, res, next) {
    console.log("get all project stubs rout hit: req.params.uid: " +  req.params.uid);
    Project.aggregate([
        { $match: {
            uid: req.params.uid
        }},
        {$project : {_id: 1, uid: 1, title: 1, client: 1, dueDate: 1}
    }
    ], function (err, result) {
        if (err) {
            console.log("err finding project stubs: " + err);
            res.status(400);
            return;
        }
        if (err) return next(err);
        res.status(201);
        res.json(result);
    });
};  


//GET PROJECT BY ID
module.exports.getProjectById = function (req, res, next) {
    console.log("get project by id rout hit: req.params.uid: " +  req.params.pid);
    Project.find({_id: req.params.pid}, function (err, project) {
        if (err) return next(err);
        res.status(201);
        res.json(project);
    });
};  

//DESTROY PROJECT
module.exports.destroyProject = function (req, res, next) {
    console.log("destroy project rout hit. pid received: " + req.params.pid);
    Project.findById(req.params.pid)
    .remove(function (err, result) {
        console.error(err);
        if (err) return next(err);
        res.json(result);
        console.log("deleted: " + result);
    })
};

//UPDATE PROJECT
module.exports.updateProject = function(req,res,next){
 console.log("update project prject rout hit.");
 Project.findByIdAndUpdate(
    req.body._id,
    {
        $set: 
        {
          uid: req.body.uid,
          title: req.body.title,
          client: req.body.client,
          dueDate: req.body.dueDate
      }
  },
        // options
        {
            safe : false, // write concern, slower if false, but safer
            upsert : false, // create new doc if none matches query (false, so don't)
            new : true // return updated document after $push
        },
        // callback
        function(err, project) {
            if(err) return next(err);
            console.log(project);
            res.status(202); // Accepted
            res.json(project); // return the updated obj
        });
};

////////////////////////// TODOS ////////////////////////

//INSERT TODO
module.exports.insertTodo = function(req,res,next){
    var t = req.body;
    console.log(t.pid);
    Project.findByIdAndUpdate(
        t.pid,
        {$push: {"tasks": 
        {

            pid: t.pid,
            task: t.task,
            category: t.category,
            hours: t.hours,
            recording: false,
            lastStart: null,
            completed: t.completed,
            notes: t.notes
        }

    }},
    {upsert: true,
    upsert : false, // create new doc if none matches query (false, so don't)
    new : true // return updated document after $push
},
function(err, todo) {
    if (err){
        console.error("errer inserting todo: " + err);
         res.status(400); // Accepted
            res.json({stat: "Error saving task"}); // return the updated obj   
            return next(err);
        }
            console.log(todo);    
            res.status(201);
            res.json({stat: true}); 
            console.log("inserted new todo");
        }
        );

};


//UPDATE TODO
module.exports.updateTodo = function(req,res,next){
  var t = req.body;
  Project.update(
    {_id: t.pid, 'tasks._id': t._id}, 
    {'$set': {
        'tasks.$.task' : t.task,
        'tasks.$.category' : t.category,
        'tasks.$.hours' : t.hours,
        'tasks.$.lastStart' : t.lastStart,
        'tasks.$.recording' : t.recording,
        'tasks.$.completed' : t.completed,
        'tasks.$.notes' : t.notes        
    }},
    function(err, todo) {
     if (err){
        console.error("errer updating todo: " + err);   
        return next(err);
    }
            res.status(202); // Accepted
            res.json(todo); // return the updated obj
            console.log("updated todo");
        }
        );
};

//DESTROY TODO 
module.exports.destroyTodo = function (req, res, next) {
 var t = req.body;
 console.log("destroy todo rout hit. pid received: " + t.pid + " " + t.tid);

 Project.update(
    {_id: t.pid}, 
    { $pull: {
        'tasks' : { _id: t.tid} 
    }},
    function(err, todo) {
     if (err){
        console.error("errer updating todo: " + err);   
        return next(err);
    }
            res.status(202); // Accepted
            res.json(todo); // return the updated obj
            console.log("deleted todo: " + todo);
        }

        );
};


//GET ALL TODOS
module.exports.getAllTodos = function (req, res, next) {
    console.log("get all todos rout hit: req.params.pid: " +  req.params.pid);

    Project.findById({_id: req.params.pid}, function (err, project) {
      if (err){
        console.error("errer getting all todos: " + err);   
        return next(err);
    }
    res.status(202); 
    res.json(project.tasks); 
    console.log("got all todos: " + project.tasks);
});
};  
