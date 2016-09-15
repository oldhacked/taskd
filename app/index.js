
//LIBS
// import moment from 'moment/moment.js';
// import angularMoment from 'angular-moment/angular-moment.js';
// const momentTimezone = require('moment-timezone');
import Bootstrap from 'bootstrap-sass/assets/javascripts/bootstrap';

//APP
import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
//STYLES
// require('./common/bootstrap.styles.scss');
require('./project/project-base-pack/project.styles.scss');

import _ from 'lodash';
//REGISTER
	//routes
import routing from './app.config';
	//controllers	
import root from './app.run';
	//services
import jwt from './user/user.auth'
	//modules 
import login from './login';
import project from './project';
	//direcives
import taskrow from './project/todo-pack/directives/taskrow.js';

angular.module('app', [uirouter, login, project, jwt, ngAnimate, taskrow])
	.run(root)
	.constant('API_URL','http://localhost:3000')
	.config(routing);


