 // /* @ngInject */
 // export default function projectRoot($rootScope, $state, $stateParams) {

 // 	$rootScope.$state = $state;
 // 	$rootScope.$stateParams = $stateParams;

 	  
             
             

 // };
 
 // projectRoot.$inject = ['$rootScope', '$state', '$stateParams'];



  /* @ngInject */
 export default function projectRoot($rootScope, authService, $location, $stateParams) {

 	      
 	   	// $rootScope.$stateParams = $stateParams;
       

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
 
projectRoot.$inject = ['$rootScope', 'authService', '$location', '$stateParams'];