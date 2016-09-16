


/* @ngInject */
export default function routing($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
	.state('base', {
		url: '',
		abstract: true
	});
  $locationProvider.html5Mode({
            enabled: true, // turn html5Mode on
            requireBase: true // require a '<base> tag'
        });
  $urlRouterProvider.otherwise('/');
}


routing.$inject = ['$stateProvider','$urlRouterProvider', '$locationProvider' ];


