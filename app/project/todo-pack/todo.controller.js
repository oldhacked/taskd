
require('./todo.styles.scss');
/*@ngInject*/
export default function todoCtrl($scope, todoService, $interval, $timeout, authService, $rootScope, $stateParams, ngAnimate){

	 // console.log($rootScope.projectId + "from todo controller");

	 var tCtrl = this;
	// tCtrl.projectId = $rootScope.projectId;
	tCtrl.greeting = "Todo";

	//ROOT SCOPE
	console.log($rootScope.sParams.proj);
	$scope.pid = $rootScope.sParams.proj;

	//TODO SERVICE
	tCtrl.getTodos = todoService.getTodos;
	tCtrl.removeme = todoService.removeme;
	tCtrl.updatetodo = todoService.updatetodo;
	//AUTH SERVICE
	tCtrl.user = authService.currentUser();
	tCtrl.uid = tCtrl.user._id;
	var token =  authService.getToken();

	

////////////////PROJECT/////////////////////

var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

//GET PROJECT ON STATE CHANGE
tCtrl.project = {};
tCtrl.todos = [];
tCtrl.createdDate;
$scope.$watch("state", function(newValue, oldValue) {

	console.log("state change: " + newValue + " " + oldValue);

	tCtrl.loadProject = function () {

		todoService.getProjectById($scope.pid, token)
		.then(function success(response) {
			console.log("project loaded: " + response.data);
			tCtrl.project = response.data[0];
			tCtrl.todos = tCtrl.project.tasks;

			//assign due date to panel
			tCtrl.timeFromNow = "Due: " + moment(tCtrl.project.dueDate).fromNow();
			// assign due date to form
			tCtrl.project.dueDateFormatted = moment(tCtrl.project.dueDate);
			tallyUp();
			timeLeftChart();
			gatherCats();


			
		}, handleError);
	};
$timeout(function() {
	tCtrl.loadProject();
}, 100);
	

});

tCtrl.editingProj = true;



////////////////CATEGORIES//////////////////////

tCtrl.categories = [];
var uniqCats = [];
function gatherCats(){

	uniqCats = _.uniqBy(tCtrl.todos, 'category');




	_.forEach(uniqCats, function(value, key) {
		tCtrl.categories.push(value.category)
	});

	console.log("unique categories: " + tCtrl.categories);
	console.log(tCtrl.categories);

}

tCtrl.setCat = function(cat){
	tCtrl.catFilter = cat;
}











////////////////TODOS////////////////////////
tCtrl.newTaskAdvisory = "";
	//tests
	// tCtrl.newTodoTitle = "new task derp face"
	// tCtrl.newTodoCat = "css"
	// tCtrl.newTodoHours = "00";
	// tCtrl.newTodoMin = "00";
	// tCtrl.newTodoNotes = "notes notes notes... i love notes?";

	tCtrl.exp = false;
	tCtrl.expand2 = "expand2";
	tCtrl.contract2 = "contract2";
	tCtrl.fadein2 = "fadein2";
	tCtrl.fadeout2 = "fadeout2";

	
	tCtrl.loadTodos = function () {
		console.log("data loaded");

		tCtrl.getTodos($scope.pid, token)
		.then(function (response) {
			tCtrl.todos = response.data;
			console.log(response.data);
			tallyUp();
		});
	};


//////////////
	tCtrl.newTaskCancel = function(){
		tCtrl.newTaskAdvisory = tCtrl.newTodoTitle = tCtrl.newTodoHours = tCtrl.newTodoCat = tCtrl.newTodoSdate = tCtrl.newTodoEdate = tCtrl.newTodoNotes = '';
	}
	//ADD TODO
	tCtrl.newtask;
	tCtrl.addTodo = function (newTodoTitle, newTodoCat, newTodoNotes) {
		//temporary fill

		if(newTodoTitle == "" || newTodoTitle == null || newTodoTitle == undefined || newTodoTitle == " "){
			tCtrl.newTaskAdvisory = "You must include a task title";


		}else{
			var newTodoHours = "00";
			var newTodoMin = "00";
			var formConcat = newTodoHours + ":" + newTodoMin + ":00";
			console.log("form formConcat: " + formConcat);

			var todo = {
				pid: $scope.pid,
				task: newTodoTitle,
				category:  newTodoCat,
				hours: formConcat,
				recording: false ,
				lastStart: null,
				completed: false,
				notes: newTodoNotes
			};
			console.log(todo);
			todoService.addTodo(todo, token)
			.then(function success(response) {

				if(response.data){
					console.log(response.data);
					tCtrl.newTaskAdvisory = tCtrl.newTodoTitle = tCtrl.newTodoHours = tCtrl.newTodoCat = tCtrl.newTodoSdate = tCtrl.newTodoEdate = tCtrl.newTodoNotes = '';
					tCtrl.exp = false;
				}

			} , function (response){tCtrl.newTaskAdvisory = response.data.stat;});
			tCtrl.loadTodos();
		}
	};

	function handleError(response){
		if(response.data){
			tCtrl.advisory = response.data;
		}

	};


	tCtrl.destroy = function (t) {
		console.log(t._id);
		var ptData = {
			pid : $scope.pid,
			tid : t._id
		};
		todoService.removeTodo(ptData, token);
		tCtrl.loadTodos();
	};

	tCtrl.updatestat = function (todo) {
		console.log("updatestat: " + todo.completed);
		todoService.updatetodo(angular.copy(todo), token)
		.then(function success(response) {
			tCtrl.loadTodos();

		});

	};

	tCtrl.alrt = false;
	tCtrl.editTaskAdvisory = "derp";
	tCtrl.update = function (todo) {
		tCtrl.editForm = true;
		tCtrl.taskedit = angular.copy(todo);
	};

	tCtrl.save = function (todo) {
		console.log("task was edited");
		todoService.updatetodo(angular.copy(todo), token);
		tCtrl.loadTodos();
		tCtrl.cancel();
	};


	tCtrl.cancel = function () {
		tCtrl.editForm = false;
		tCtrl.taskedit = "";
	};



	tCtrl.toggleRec = function(task, newTime){
		console.log("toggling record");
		if(task.recording == false){

			var ls = new Date();

			var todo = {
				pid: $scope.pid,
				_id: task._id,
				task: task.task,
				category: task.category,
				hours: task.hours,
				lastStart: ls,
				recording: true,
				completed: task.completed,
				notes: task.notes
			}

			todoService.updatetodo(angular.copy(todo), token)
			.then(function success(response) {
				console.log(response);
				tCtrl.loadTodos();
			});
		}else if (task.recording == true){
			var ls = new Date();

			var todo = {
				pid: $scope.pid,
				_id: task._id,
				task: task.task,
				category: task.category,
				hours: newTime,
				lastStart: null,
				recording: false,
				completed: task.completed,
				notes: task.notes
			}

			todoService.updatetodo(angular.copy(todo), token)
			.then(function success(response) {
				console.log(response);
				tCtrl.loadTodos();
			});

		}
	};



    /////////LOGIC FOR DISPLAYING COMPLETED OR NOT COMPLETED//////////////
    tCtrl.showCompleted = false;

    tCtrl.numCompleted = function (tf) {
    	var comp = 0;
    	var nonComp = 0;
    	tCtrl.todos.forEach(function (todo) {
    		if (!todo.completed) {
    			nonComp++;
    		} else {
    			comp++;
    		}
    	});
    	if (tf == "true") {
    		return comp;
    	} else {
    		if (nonComp <= 3) {
    			tCtrl.alert = "chillin";
    		}
    		if (nonComp > 3 && nonComp < 5) {

    			tCtrl.alert = "warning";
    		} else if (nonComp > 5) {
    			tCtrl.alert = "danger";
    		}
    		return nonComp;
    	}
    }







//////////////CHARTS!!!//////////////////
//KEEP
// var d = moment.duration(formConcat);
// var x = moment.duration(formConcat).asMilliseconds();
// var dur = Math.floor(d.asHours()) + moment.utc(x).format(":mm:ss");

//TIME LEFT CHART
function timeLeftChart(){
		//get date created from objec id
		tCtrl.createdDate = new Date(dateFromObjectId($scope.pid));
		/////////TIME LEFT CHART/////////
		// get time duration between created date and due date
		var ms = moment(tCtrl.project.dueDate ,"YYYY/MM/DD HH:mm:ssZ").diff(moment(tCtrl.createdDate,"YYYY/MM/DD HH:mm:ssZ"));
		// console.log("###############ms: " + ms);
		var d = moment.duration(ms);
		// console.log("duration between created date and due date in ms: " + d);
		var totalProjTime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
		// console.log('total project time vefore as hours' + totalProjTime);
		var tptasMs = moment.duration(totalProjTime);
		var tptAsHours = moment.duration(totalProjTime).asHours();
		// console.log("total project time as hours: " + tptAsHours);
		//
		var today = new Date();
		tCtrl.today = today;
		var due = new Date(tCtrl.project.dueDate);
		// console.log("#################" + due);
		//get duration from now till due date
		var timeleft = moment(due,"YYYY/MM/DD HH:mm:ssZ").diff(moment(today,"YYYY/MM/DD HH:mm:ssZ"));
		var tlDuration = moment.duration(timeleft);
		var difMs = moment.duration(tptasMs).subtract(tlDuration);
		// console.log("dif ms: " + difMs);
		var difMsAsHr = moment.duration(difMs).asHours();
		// console.log( "dif ms as hr: " + difMsAsHr);
		var tldAsHr = tlDuration.asHours();
		// console.log("time left as hours: " + tldAsHr);
		// console.log("!@#$" + [tldAsHr, difMsAsHr]);
		if(difMsAsHr > 0 && tldAsHr > 0){
			tCtrl.chartdataTL = [tldAsHr, difMsAsHr];
		}else{
			tCtrl.chartdataTL = [0, 0];
		}
		tCtrl.chartlabelsTL = ["time left " , " difference"];
		tCtrl.chartoptionsTL = {cutoutPercentage: 90};
		tCtrl.chartcolorsTL = ['#85C1BD','#F3F5F6'];
	}





//TOTAL HOURS CHART
var fornow = 0;
tCtrl.fudge = function(){
	fornow = tCtrl.totalHours * 0.10
	return fornow;
}
tCtrl.totalHours = 0;
tCtrl.totalMs = 0;
tCtrl.gms = 0;
function tallyUp(){
	var ms = 0;
	var totalMs = moment.duration(0, 'ms');
	function addThenConvert(callback){

		_.forEach(tCtrl.todos, function(value, key) {
			ms = moment.duration(value.hours).asMilliseconds();
			// console.log("value hours as ms: " + ms);
			totalMs = moment.duration(totalMs).add(ms, 'milliseconds');
			// console.log(totalMs);
		});

		callback(totalMs);
	}

	var convert = function(totes){
		// console.log(totes);
		var d = moment.duration(totes);
		tCtrl.totalMs = d;
		var x = Math.floor(d.asHours()) 
		// console.log(x);

		var z = moment.utc(d.asMilliseconds()).format(':mm:ss')
		tCtrl.gms = d.asMilliseconds();
		// console.log("total duration: " + x + z);
		// tCtrl.totalHours = x + z;
		tCtrl.totalHours = x;

		///////////////TOTAL HOURS CHART////////////////////////

		tCtrl.chartlabels = ["hours", "Project Average"];
		var aaa = parseInt(tCtrl.totalHours);

		tCtrl.chartdata = [aaa, aaa * 0.10];

		tCtrl.chartoptions = {cutoutPercentage: 90};
		tCtrl.chartcolors = ['#B684BA','#F3F5F6'];
	}

	addThenConvert(convert);
};


$scope.$watch("[todos.hours]", function(newValue, oldValue) {

	// console.log(newValue, oldValue);

	tallyUp();

});


};

todoCtrl.$inject = ['$scope', 'todoService', '$interval', '$timeout', 'authService', '$rootScope', '$stateParams']