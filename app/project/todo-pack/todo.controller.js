/*@ngInject*/
export default function todoCtrl($scope, todoService, $interval, $timeout, authService, $rootScope, $stateParams){

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

	//GET PROJECT ON STATE CHANGE
	tCtrl.project = {};
	tCtrl.todos = [];
	$scope.$watch("state", function(newValue, oldValue) {

		console.log("state change: " + newValue + " " + oldValue);

		tCtrl.loadProject = function () {

			todoService.getProjectById($scope.pid, token)
			.then(function success(response) {
				console.log("project loaded: " + response.data);
				tCtrl.project = response.data[0];
				tCtrl.todos = tCtrl.project.tasks;
				tCtrl.project.dueDate = moment(tCtrl.project.dueDate).fromNow();
				tallyUp();
			}, handleError);
		};

		tCtrl.loadProject();

	});

	tCtrl.editingProj = true;



////////////////TODOS////////////////////////
tCtrl.newTaskAdvisory = "test";
	//tests
	tCtrl.newTodoTitle = "new task derp face"
	tCtrl.newTodoCat = "css"
	tCtrl.newTodoHours = "00";
	tCtrl.newTodoMin = "00";
	
	tCtrl.newTodoNotes = "notes notes notes... i love notes?";

	
	tCtrl.loadTodos = function () {
		console.log("data loaded");
		tCtrl.getTodos($scope.pid, token)
		.then(function (response) {
			tCtrl.todos = response.data;
			console.log(response.data);
			tallyUp();

		});



	};



tCtrl.totalHours = 0;

function tallyUp(){


	var ms = 0;
	var totalMs = moment.duration(0, 'ms');
	function addThenConvert(callback){

		_.forEach(tCtrl.todos, function(value, key) {
			ms = moment.duration(value.hours).asMilliseconds();
			console.log("value hours as ms: " + ms);
			totalMs = moment.duration(totalMs).add(ms, 'milliseconds');
			console.log(totalMs);
		});

		callback(totalMs);
	}

	var convert = function(totes){
		console.log(totes);
		var d = moment.duration(totes);

		var x = Math.floor(d.asHours()) 
		console.log(x);
		var z = moment.utc(d.asMilliseconds()).format(':mm:ss')

		console.log("total duration: " + x + z);
		tCtrl.totalHours = x + z;
	}

	addThenConvert(convert);
};


	$scope.$watch("[todos.hours]", function(newValue, oldValue) {

		console.log(newValue, oldValue);

		tallyUp();

	});











//KEEP

// var d = moment.duration(formConcat);

// var x = moment.duration(formConcat).asMilliseconds();

// var dur = Math.floor(d.asHours()) + moment.utc(x).format(":mm:ss");











	// var h = moment.duration(newTodoHours);

	// var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
	// var ndate = new Date();
	// var thenLSUTC = moment().utc(ndate.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ");
	// console.log("************* NEW DATE: " + ndate + " ndate lsUTC: " + thenLSUTC );



	// var firstDate = new Date();

	// var d = moment.duration('01:05:30');
	// var x = moment.duration('01:05:30').asMilliseconds();
	// console.log(x);
	// // var x = moment.utc(d).format(":mm:ss");
	// var y = Math.floor(d.asHours()) + moment.utc(x).format(":mm:ss");
	// // moment.utc(x).format(":mm:ss")
	// console.log("d duration: " + d + " formatted: " + y);
	



	// var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

	// console.log("duration ms: " + d + " formated: " + s);

	// $timeout(function() {
	// 	var secondDate = new Date();


	// 	var firstLSUTC = moment().utc(firstDate.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ");
	// 	var secondLSUTC = moment().utc(secondDate.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ");
	// 	var ms = moment(secondLSUTC,"YYYY/MM/DD HH:mm:ssZ").diff(moment(firstLSUTC,"YYYY/MM/DD HH:mm:ssZ"));
	// 	var d = moment.duration(ms);

	// 	var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

	// 	console.log("duration ms: " + d + " formated: " + s);


	// }, 10000);














	//ADD TODO
	tCtrl.newtask;
	tCtrl.addTodo = function (newTodoTitle, newTodoHours, newTodoMin, newTodoCat, newTodoNotes) {

		// var h = moment.duration(newTodoHours);

		// var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
		// console.log("new taks that was added");

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
				tCtrl.newTodoTitle = tCtrl.newTodoHours = tCtrl.newTodoCat = tCtrl.newTodoSdate = tCtrl.newTodoEdate = tCtrl.newTodoNotes = '';
			}

		} , function (response){tCtrl.newTaskAdvisory = response.data.stat;});
		tCtrl.loadTodos();

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
};

todoCtrl.$inject = ['$scope', 'todoService', '$interval', '$timeout', 'authService', '$rootScope', '$stateParams']