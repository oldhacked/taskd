
import angular from 'angular';
require('./taskrow.styles.scss');

/* @ngInject */
function taskrow( $interval, $compile, $animate) {
	
	return {

		







		restrict: 'AE',
		template: require('./taskrow.directive.html'),
		// compile: function(cElement, cAttrs) {
		// 	console.log('how many times I am called');
		// },
		// replace: true,
		scope: 
		// true,
		{
			t: '=',
			// ctrl: '='
		}
		,



		link : function(scope, element, attrs, ctrl){


		//STYLES
		scope.exp = false;

	

		scope.editslide = false;

		scope.taskedit = {};
		scope.edit = function(task){
			scope.taskedit = angular.copy(task);
		}

		// [editslide ? 'expandmore' : 'expandless, 'exp ? 'expandouter' : 'contractouter']

		scope.wrapper = function(){
			

			if (scope.exp != true){
				scope.innertaskwrap = "contractouter";
			}
			if (scope.exp == true){
				scope.innertaskwrap = "expandouter";
			}
			if(scope.editslide != false){
				scope.innertaskwrap = "expandmore";
			}
			if(scope.editslide == false && scope.exp == true){
				scope.innertaskwrap = "expandless";
			}

		};

		scope.ctrl = scope.$parent.tCtrl;

			//PASS THE PARENT CONTROLLER TO THE DIRECTIVE


			scope.task = function() {

				return scope.t;
			};


			scope.chartcolors =  ['#F3848E','#F3F5F6'];
			scope.chartoptions = {cutoutPercentage: 82, tooltips: { enabled: false }};
			scope.chartlabels = ['Hours', 'Relative Average'];



			var hoursAsMs = moment.duration(scope.task().hours).asMilliseconds();
			var totalAsMs = scope.ctrl.gms;
			var average = totalAsMs / scope.ctrl.todos.length;

			scope.chartdata = [ hoursAsMs, average];

			// console.log("****************: " + [ moment.duration(scope.task.hours), moment.duration(scope.ctrl.gms)]);
			// console.log("****************: " + [ moment.duration(scope.task().hours).asMilliseconds(), scope.ctrl.gms]);

			if(scope.t.recording == true){
				scope.swctrl.start();

				//CALCULATE THE DURATION SINCE LAST START
				var now = new Date();
				// console.log("last start: " + scope.t.lastStart);
				var d = new Date(scope.t.lastStart);
				// console.log("last as new date: " + d);
				var thenLSUTC = moment().utc(d.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ");
				// console.log("thenLSUTC" + thenLSUTC);
				var nowLSUTC = moment().utc(now.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ");
				// console.log("nowLSUTC" + nowLSUTC);

				var ms = moment(now,"YYYY/MM/DD HH:mm:ssZ").diff(moment(d,"YYYY/MM/DD HH:mm:ssZ"));
				var d = moment.duration(ms);
				var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

				// console.log(s);

				scope.swctrl.setTotalElapsed(scope.task().hours, s);

				// scope.swctrl.totalElapsedMs = s;



				//FAILED ATTEMPTS (SNIPPETS)

				// var now = moment( new Date());

				// var then = d.toLocaleString();

				// .replace(/\//g,'-')
				// console.log("then to local string: " + then);
				// console.log("then to local string to utc: " + moment().utc(then.toLocaleString()).format("YYYY/MM/DD HH:mm:ssZ"));
				// console.log("now to local string to UTC: " + nowUTC);
				// console.log("now to local string: " + now.toLocaleString());
				// now = moment().utc(now).format("YYYY-MM-DD HH:mm:ssZ");
				// console.log("now" + now);
				// var elapsed = now - last ;
				// console.log("now" + now);
				// console.log("last: " + last);
				// console.log("elapsed: " + elapsed);
				// console.log( "elapsed moment: " + moment(elapsed).format("YYYY-MM-DD HH:mm:ssZ"));
				// // moment('2016-03-12 13:00:00').add(1, 'day').format('LLL')
				// console.log(now.subtract(last));
				// var now  = "04/09/2013 15:00:00";
				// var then = "02/09/2013 14:20:30";
				// console.log("last start date of this recording: " + scope.t.lastStart);
				// var nowUTC = moment().utc(now).format("YYYY-MM-DD HH:mm:ssZ");
				// console.log("now UTC: " + nowUTC);
				// console.log("now UTC moment: " + moment(nowUTC));
				// var timeElapsed = moment.duration(nowUTC.diff(scope.t.lastStart));
				// var mte = moment(timeElapsed);
				// console.log(timeElapsed);
				// console.log("now - lastStart: " + mte);







			}else{
				scope.swctrl.setTotalElapsed(scope.task().hours, 0);
			}
			
			// scope.t = attrs.title
			// var tsk = $interpolate('task');
			// scope.t = tsk(scope.$parent);
		},
		
		controllerAs: 'swctrl',

		controller: function($scope) {






			// console.log("Creating the directive's controller");
			var self = this;
			var totalElapsedMs = 0 ;
			var elapsedMs = 0;
			var startTime;
			var timerPromise;
			var time;
			var recording = false;


			self.setTotalElapsed = function(taskTime, pastTime){


				totalElapsedMs = moment.duration(taskTime) + moment.duration(pastTime);



			};



			var count = 0;
			var d = 0;
			var hours = 0; 
			var mins = 0; 
			self.stop = function() {
				if (timerPromise) {
					$interval.cancel(timerPromise);
					timerPromise = undefined;
					totalElapsedMs += elapsedMs;
					elapsedMs = 0;
				}
			};

			self.start = function() {

				if(recording === false){
					console.log("starting time");
					if (!timerPromise) {
						startTime = new Date();
						console.log("startTime: " + startTime);
						timerPromise = $interval(function() {
							var now = new Date();




							var x = (now.getTime() - startTime.getTime());

							// d = moment.duration(count++, 'seconds');
							// hours = Math.floor(d.asHours());
							// mins = Math.floor(d.asMinutes()) - hours * 60;
							// console.log("hours:" + hours + " mins:" + mins + " sec:" + d / 1000);


							// if(hours > 0){
							// 	elapsedMs = hours + " hr";
							// }else if(mins > 0){
							// 	elapsedMs = mins + " min";
							// }else{
							// 	elapsedMs = (d / 1000) + " sec";
							// }



							// Math.floor(x / 1000)
							elapsedMs = x;
							// elapsedMs = y;
							// elapsedMs = count++;
						}, 1000);
					}
					recording = true;

				} else if(recording === true){
					// console.log("stop time");
					self.stop();
					recording = false;
				}


				
			};






			self.reset = function() {
				startTime = new Date();
				totalElapsedMs = elapsedMs = 0;
			};

			self.getTime = function() {
				return time;
			};


			

			var tet;
			var tetMoment;

			self.getElapsedMs = function() {
				tet =  totalElapsedMs + elapsedMs;
				tetMoment = moment.duration(tet);
				var hms = Math.floor(tetMoment.asHours()) + moment.utc(tet).format(":mm:ss");
				
				return  hms;
			};

			self.getMs = function(){

				return tetMoment;
			}



		}

	}
};


/* @ngInject */
export default angular.module('directives.taskrow', [])
.directive('taskrow', taskrow)
.filter('secondsToDateTime', [function() {
	return function(seconds) {
		return new Date(1970, 0, 1).setSeconds(seconds);
	};
}])
.name;

taskrow.$inject = ['$interval', '$compile', '$animate']