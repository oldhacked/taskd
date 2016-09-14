/* @ngInject */
export default function routes($stateProvider) {
	$stateProvider
	.state('base.login', {
		url: '/',
		views: {
			'@': {
				template: require('./login-pack/login.view.html'),
				controller: 'LoginCtrl as lCtrl'
			}
		}
	});
}
routes.$inject = ['$stateProvider'];