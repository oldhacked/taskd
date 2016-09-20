/*@ngInject*/
export default function projectCtrl($scope, todoService, authService, $rootScope, $location, $state, $stateParams){



	var pCtrl = this;

	pCtrl.greeting = "Projects";
	pCtrl.user = authService.currentUser();
	pCtrl.uid = pCtrl.user._id;
	pCtrl.token =  authService.getToken();



	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});


	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			$(this).addClass('animated ' + animationName).one(animationEnd, function() {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});


	pCtrl.logout = function(){
		authService.logout();
		pCtrl.user = null;
		$rootScope.isLoggedin = false;
		$location.path('/');
	}





	 // console.log($rootScope.projectId + "from todo controller");

	 
	// tCtrl.projectId = $rootScope.projectId;
	

	////////////////CRUD////////////////

	pCtrl.projects = [];

	pCtrl.loadData = function () {
		console.log("data loaded");
		todoService.getProjectStubs(pCtrl.uid, pCtrl.token)
		.then(function (response) {
			pCtrl.projects = response.data;
			console.log(response.data);
		});
	};


	pCtrl.deleteProj = function(pid){
		console.log(pid);
		todoService.deleteProject(pid, pCtrl.token)
		.then(function success(response) {

			if(response.data){
				$location.path("projects//new-project");
				pCtrl.loadData();
			}

		});
	};






	pCtrl.loadData();









	pCtrl.today = function() {
		pCtrl.dt = new Date();
	};
	pCtrl.today();

	pCtrl.clear = function() {
		pCtrl.dt = null;
	};

	pCtrl.options = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

 // Disable weekend selection
 function disabled(data) {
 	var date = data.date,
 	mode = data.mode;
 	return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
 }







  // Disable weekend selection
  function disabled(data) {
  	var date = data.date,
  	mode = data.mode;
  	return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }





  pCtrl.toggleMin = function() {
  	pCtrl.options.minDate = pCtrl.options.minDate ? null : new Date();
  };

  pCtrl.toggleMin();


  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  pCtrl.events = [
  {
  	date: tomorrow,
  	status: 'full'
  },
  {
  	date: afterTomorrow,
  	status: 'partially'
  }
  ];

  function getDayClass(data) {
  	var date = data.date,
  	mode = data.mode;
  	if (mode === 'day') {
  		var dayToCheck = new Date(date).setHours(0,0,0,0);

  		for (var i = 0; i < pCtrl.events.length; i++) {
  			var currentDay = new Date(pCtrl.events[i].date).setHours(0,0,0,0);

  			if (dayToCheck === currentDay) {
  				return pCtrl.events[i].status;
  			}
  		}
  	}

  	return '';
  }
























// 		function tallyUp(){


// 		var ms = 0;
// 		var totalMs = moment.duration(0, 'ms');
// 		function addThenConvert(callback){

// 			_.forEach(pCtrl.todos, function(value, key) {
// 				ms = moment.duration(value.hours).asMilliseconds();
// 				console.log("value hours as ms: " + ms);
// 				totalMs = moment.duration(totalMs).add(ms, 'milliseconds');
// 				console.log(totalMs);
// 			});

// 			callback(totalMs);
// 		}

// 		var convert = function(totes){
// 			console.log(totes);
// 			var d = moment.duration(totes);
// 			tCtrl.totalMs = d;
// 			var x = Math.floor(d.asHours()) 
// 			console.log(x);

// 			var z = moment.utc(d.asMilliseconds()).format(':mm:ss')
// 			tCtrl.gms = d.asMilliseconds();
// 			console.log("total duration: " + x + z);
// 		// tCtrl.totalHours = x + z;
// 		tCtrl.totalHours = x;
// 	}

// 	addThenConvert(convert);
// };





















function clearNewForm(){

	pCtrl.newProjTitle = "";
	pCtrl.newProjClient = "";
	pCtrl.newProjDueDate = "";
	pCtrl.newProjRate = "";
};


pCtrl.createNewProj = function(title, client, dueDate, rate){


	var project = {

		uid: pCtrl.uid,

		title: title,
		client: client,
		dueDate: dueDate,
		rate: rate
	};
	todoService.createNewProject(project, pCtrl.token)
	.then(function success(response){
		clearNewForm();
		pCtrl.loadData();
		console.log(response.data.title);
			// $rootScope.projectId =
			$state.go('base.projects.dashboard', {proj: response.data._id} );
		});

};




pCtrl.projCal = "h";
var done3 = false;
pCtrl.projCalTog = function(){
	
	console.log("proj cal");
	if(done3 == false){
		pCtrl.projCal = "s";
		done3 = true;

	}else if(done3 == true){
		pCtrl.projCal = "h";
		done3 = false;
	}
}













};

projectCtrl.$inject = ['$scope', 'todoService','authService', '$rootScope', '$location', '$state', '$stateParams']