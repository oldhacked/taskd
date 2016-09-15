var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var todoSchema = new Schema({
 
//     uid: {type: String, required: true},
//     task: {type: String, required: true, maxlength : 100},
//     completed: {type : Boolean},
// });


var todoSchema = new Schema({
 
    pid: {type: String, required: true},
    task: {type: String, required: true, maxlength : 100},
    category: {type: String, maxlength: 100},
    hours: {type: String, maxlength : 100},
    recording: {type: Boolean},
    lastStart: {type: Date, maxlength : 100},
    completed: {type : Boolean},
    notes: {type: String, maxlength: 4000}
    
});

var projectSchema = new Schema({

	uid: {type: String, required: true},
	title: {type: String, required: true, maxlength : 100},
	client: {type: String, maxlength : 100},
	dueDate: {type: Date, maxlength : 100},
    rate: {type: Number, maxlength : 100},
	tasks: [todoSchema]

});



var project = mongoose.model('Project', projectSchema);

module.exports = project;


