 /* @ngInject */
 export default function root($rootScope, authService, $location, $stateParams) {

 	      

       	$rootScope.sParams = $stateParams;

       	// console.log("rootscope stateparams in app.run" + $rootScope.sParams);
       // $rootScope.$state = $state;
       

 	var derp = authService.tester(5);
 	console.log(derp);
 	$rootScope.$watch(function() { return $location.path(); }, function(newValue, oldValue){  

 		$rootScope.isLoggedin = authService.isLoggedIn();
 		console.log(newValue + " " + $rootScope.isLoggedin);
 		if ($rootScope.isLoggedin == false && newValue != '/'){  
 			$location.path('/');  
 		}  
 	});
 };
 
 root.$inject = ['$rootScope', 'authService', '$location', '$stateParams'];