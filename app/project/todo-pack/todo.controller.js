
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

	tCtrl.visual = "h";

////////////////PROJECT/////////////////////

var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

//GET PROJECT ON STATE CHANGE
tCtrl.project = {};
tCtrl.todos = [];
tCtrl.createdDate;

tCtrl.panelTimeLeft = "h";
tCtrl.panelTotalHours = "h";
tCtrl.panelHoursByCat = "h";



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
			// var ddate = new Date(tCtrl.project.dueDate);

			tCtrl.project.dueDateFormatted = moment(tCtrl.project.dueDate).format("YYYY/MM/DD");


			tCtrl.panelTimeLeft = "s";
			timeLeftChart(true);




	}, handleError);
	};

	$timeout(function() {
		tCtrl.loadProject();
	}, 100);
	

});



tCtrl.delProjClicked = false;

tCtrl.projModal = "h";
var done2 = false;
tCtrl.delProjTog = function(){
	
	console.log("delet project");
	if(done2 == false){
		tCtrl.projModal = "s";
		done2 = true;

	}else if(done2 == true){
		tCtrl.projModal = "h";
		done2 = false;
	}
}





tCtrl.projCal = "h";
var done3 = false;
tCtrl.projCalTog = function(){
	
	console.log("proj cal");
	if(done3 == false){
		tCtrl.projCal = "s";
		done3 = true;

	}else if(done3 == true){
		tCtrl.projCal = "h";
		done3 = false;
	}
}





var done1 = false;

tCtrl.tog = function(){
  //jquery toggleClass does not work


  if(done1 == false){
  	$('#tog').addClass('is-transitioned');
  	done1 = true;

  }else if(done1 == true){
  	$('#tog').removeClass('is-transitioned');
  	tCtrl.editProj = {};
  	done1 = false;
  }

};

tCtrl.copyProj = function(){
	tCtrl.editProj = angular.copy(tCtrl.project);
	tCtrl.editProj.dueDate = tCtrl.project.dueDateFormatted;
}


tCtrl.updateProj = function(project){

	todoService.updateProject(project, token)
	.then(function success(response) {

		if(response.data){
			console.log(response.data);
			tCtrl.tog();

			tCtrl.loadProject();
		}

	} );
	// , function (response){tCtrl.newTaskAdvisory = response.data.stat;}

}
























////////////////CATEGORIES//////////////////////

tCtrl.categories = [];
var uniqCats = [];
//hoursByCatChart > 
function gatherCats(callback){

	if(tCtrl.categories){
		tCtrl.categories.length = 0;
	}
	if(uniqCats){
		uniqCats.length = 0;
	}
	var temp = [];
	temp =  _.uniqBy(tCtrl.todos, 'category');
	uniqCats = angular.copy(temp);



	_.forEach(uniqCats, function(value, key) {
		tCtrl.categories.push(angular.copy(value.category));
	});


//hoursByCatChart > 
callback();

}


tCtrl.setCat = function(cat){
	tCtrl.catFilter = cat;
}



///ADDS HOUR PROPERTIES IN AN ARRAY
function addThenConvert(arry, callback){

	//will take an array of objects like { key: value, hours: 01:00:40 }
	var ms = 0;
	var totalMs = moment.duration(0, 'ms');

	//will tally up each hours value 
	_.forEach(arry, function(value, key) {
		ms = moment.duration(value.hours).asMilliseconds();
		totalMs = moment.duration(totalMs).add(ms, 'milliseconds');	
	});
	// then convert the value and return the total as well as a displayed value 
	return callback(totalMs);
}

var convert = function(totes){
	var d = moment.duration(totes);
	var hours = Math.floor(d.asHours()) 
	var minSec = moment.utc(d.asMilliseconds()).format(':mm:ss')

	var obj = {
		hours:  hours,
		minSec: minSec,
		totalMs: totes
	};
	return obj;
}



var hoursByCat = [];
var catHoursArry = [];
var keys = [];
var vals = [];

function tallyUpCats(cats, todos){
	if(catHoursArry){
		catHoursArry.length = keys.length = vals.length = 0;
	}
	for (var i = 0; i < cats.length; i++) {

	////for each unique category 
	_.forEach(todos, function(value, key) {
		///if the category in the todos list matches the unique category 
		if(value.category == cats[i]){
			//push the hours value into an array of objects so it can be tallied up by addThenConvert()
			catHoursArry.push({hours: value.hours})
		}
	});

	keys.push(cats[i]);
	vals.push(addThenConvert(catHoursArry, convert).hours);
	catHoursArry.length = 0;
};
///should return an object like {keys: ['cat', 'cat'], vals: [catHours, catHours]}
var obj = {
	keys: keys,
	vals: vals
}
return obj
}

tCtrl.catChartDone = false;
tCtrl.hbcChartReady = 0;
function hoursByCatChart(){
	tCtrl.hbcChartReady = 1;
	var tally = tallyUpCats(tCtrl.categories, tCtrl.todos);

	tCtrl.chartParams = {
		keys: tally.keys,
		vals: [tally.vals],
		series: ["Hours sum"],
		colours: [{fillColor:['#85C1BD', '#F3848E', '#F3AEA1', '#8ED8F7', '#B684BA', '#85C1BD']}],
		options: {
			animationSteps: 20,
			barShowStroke : false,
			animationEasing: "easeOutQuart",
			onAnimationComplete: function() {
				tCtrl.catChartDone = true;




			}

		}

	};
};


















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
			gatherCats(hoursByCatChart);
		});
	};


//////////////
tCtrl.newTaskCancel = function(){
	tCtrl.newTaskAdvisory = tCtrl.newTodoTitle = tCtrl.newTodoHours = tCtrl.newTodoCat = tCtrl.newTodoSdate = tCtrl.newTodoEdate = tCtrl.newTodoNotes = '';
}

tCtrl.catClicked = false;
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


		var concat = todo.hr + ":" + todo.min + ":" + todo.sec;

		var todo = {
			pid: $scope.pid,
			_id: todo._id,
			task: todo.task,
			category: todo.category,
			hours: concat,
			lastStart: todo.lastStart,
			recording: todo.recording,
			completed: todo.completed,
			notes: todo.notes
		}



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





tCtrl.tlChartDone = false;
//TIME LEFT CHART
function timeLeftChart(runNextOne){
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

		tCtrl.tlChart = {
			labels: ["time left " , " difference"],
			colours: ['#85C1BD','#F3F5F6'],
			data: [],       
			options: {
				percentageInnerCutout : 90,
				animationSteps: 20,
				animationEasing: "easeOutQuart",
				onAnimationComplete: function(){
					if(runNextOne == true){
						tCtrl.panelTotalHours = "s";
						tallyUp(true);
					}
				}}
			};









			if(difMsAsHr > 0 && tldAsHr > 0){
				tCtrl.tlChart.data = [tldAsHr, difMsAsHr];
			}else{
				tCtrl.tlChart.data = [0, 1];
			}



		}





//TOTAL HOURS CHART

tCtrl.hChartDone = false;

function tallyUp(next){
	
	var chartObj = addThenConvert(tCtrl.todos, convert);


	tCtrl.totalHours = chartObj.hours + chartObj.minSec;

	tCtrl.hoursChart = {
		labels: ["Hours", "Realative Average"],
		colours: ['#B684BA','#F3F5F6'],
		data: [],       
		options: {
			percentageInnerCutout : 90,
			animationSteps: 20,
			animationEasing: "easeOutQuart",
			onAnimationComplete: function() {
				tCtrl.hChartDone = true;
				
				if(next == true){
					tCtrl.panelHoursByCat = "s";
					gatherCats(hoursByCatChart);
				}


			}}
		};

		if(chartObj.totalMs > 0){
			tCtrl.hoursChart.data = [chartObj.totalMs, chartObj.totalMs * 0.10];
		}else{
			tCtrl.hoursChart.data = [0, 1];
		}



	};












};

todoCtrl.$inject = ['$scope', 'todoService', '$interval', '$timeout', 'authService', '$rootScope', '$stateParams']