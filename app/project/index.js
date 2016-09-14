//LIBS


//APP
import angular from 'angular';
import uirouter from 'angular-ui-router';
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


	
export default angular.module('app.project', [uirouter, projectService])
// .run(projectRoot)

.config(projectRoutes)
.controller('todoCtrl', todoCtrl)
.controller('projectCtrl', projectCtrl)
.filter('showComp', showComp)
.name;