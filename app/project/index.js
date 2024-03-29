//LIBS


//APP
import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
//STYLES
require('./project-base-pack/project.styles.scss');

//REGISTER
	//routes
import projectRoutes from './project.routes';
	//controllers
import todoCtrl from './todo-pack/todo.controller';
import projectCtrl from './project-base-pack/project.controller';
import projectRoot from './project.run';
	//services
import projectService from './project-service/todo.service';
	//directives
// import taskrow from './todo-pack/directives/taskrow.js';
	//filters
import showComp from './todo-pack/todo.filter.js';

	//vendor




	
export default angular.module('app.project', [uirouter, projectService, 'chart.js', 'ngAnimate'])
// .run(projectRoot)

.config(projectRoutes)
.controller('todoCtrl', todoCtrl)
.controller('projectCtrl', projectCtrl)
.filter('showComp', showComp)
.name;