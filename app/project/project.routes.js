/* @ngInject */
export default function projectRoutes($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
	.state('base.projects', {
		url: '/projects',
		views: {
			'@': {
				template: require('./project-base-pack/project.view.html'),
				controller: 'projectCtrl as pCtrl'
			}
			
		}
	})

	.state('base.projects.dashboard', {
		url: '/:proj',
		views: {

			'dashboard@base.projects': {
				template: require('./project-base-pack/project.dashboard.view.html'),
				controller: 'todoCtrl as tCtrl'
			}
			// ,
			// 'tasks_panel@base.projects.dashboard': {
			// 	template: require('./todo-pack/todo.tmpl.html'),
			// 	controller: 'todoCtrl as tCtrl'
			// }
			
		}
	})
	.state('base.projects.dashboard.new', {
		url: '/new-project',
		views: {

			'dashboard@base.projects': {
				template: require('./project-base-pack/project.new.tmpl.html'),
				
			}
			
		}
	})

	// './todo-pack/todo.tmpl.html'

		// 'allprojects@base.projects': {
		// 		template: require('./project-base-pack/projects.tmpl.html'),
		// 		controller: 'todoCtrl as tCtrl'
		// 	},

	// .state('base.projects', {
	// 	url: '/:proj',
	// 	views: {
		

	// 	}
	// })
;







$urlRouterProvider.otherwise('/');
}
projectRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

