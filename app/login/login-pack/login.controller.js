


/* @ngInject */


export default function LoginCtrl($scope, $location, authService, $rootScope, $interval) {

	var lCtrl = this;


    // ISODate("2016-08-10T07:00:00Z")

    lCtrl.dateTest = moment("2016-09-06T04:46:00Z").fromNow();
    // var count = 0;
    // function updateDueDate(){
    //     lCtrl.dateTest = moment("2016-09-06T04:49:00Z").fromNow() + " " + count++;
    // }

    var eventTimeStamp = '1366549200'; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
var currentTimeStamp = '1366547400'; // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT

var eventTime = new Date();
eventTime.setTime(366549200);

var Offset = new Date(eventTime.getTimezoneOffset()*60000)

var Diff = eventTimeStamp - currentTimeStamp + (Offset.getTime() / 2);
var duration = moment.duration(Diff, 'milliseconds');
var interval = 1000;

$interval(function(){
  duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
lCtrl.dateTest = moment(duration.asMilliseconds()).format('H[h]:mm[m]:ss[s]')
}, 1000);




   // $interval(updateDueDate, 1000);





	lCtrl.signingup = false;
	lCtrl.formAdvisory = "";
    lCtrl.nogo = false;
    lCtrl.cuser = authService.currentUser();

    $scope.$watch('[lCtrl.pw1, lCtrl.pw2]', function(value){
    	lCtrl.formAdvisory = "";
    	var derp = value;
    	if(lCtrl.pw1 !== lCtrl.pw2){
    		lCtrl.nogo = true;
    	}else{
    		lCtrl.nogo = false;
    	}
    });
    $scope.$watch('cuser', function(oldValue, newValue){
    	console.log(oldValue, newValue);
    	if(lCtrl.cuser != undefined){
    		console.log("is valid user: " + lCtrl.cuser);
    		lCtrl.user = authService.currentUser()
    	}else{
    		console.log("not valid user: " + lCtrl.cuser);   
    	}
    });

    lCtrl.suToggle = function(){
    	console.log("signup toggle clicked");
    	if(lCtrl.signingup == false){
    		lCtrl.signingup = true
    		console.log("signingup should be true: " + lCtrl.signingup);
    	}else if(lCtrl.signingup == true){

    		lCtrl.signingup = false
    		console.log("signingup should be false: " + lCtrl.signingup);
    	}
    };
    /////////  AUTH SERVICE /////////////////////
     function handleError(response){
        if(response.data.err){
            lCtrl.formAdvisory = response.data.err;
        }
    };

    lCtrl.login = function(username, password){
    	authService.login(username, password)
    	.then(function success(response){
    		console.log(response.data.user);
            lCtrl.user = response.data.user;
            if(response.data.sign == true){
            	$location.path("/projects");
            }
        }, handleError);
    }

    lCtrl.signup = function(username, password){
    	authService.signup(username, password)
    	.then(function success(response){
            lCtrl.user = response.data.user;
            if(response.data.sign == true){
            	$location.path("/projects");
            }
        }, handleError);
    };

    lCtrl.goto = function(url){
        $location.path(url);
    }


   
    lCtrl.logout = function(){
    	authService.logout();
    	lCtrl.user = null;
    }
};
LoginCtrl.$inject = ['$scope', '$location', 'authService', '$rootScope', '$interval'];