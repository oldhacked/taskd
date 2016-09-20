
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

import uiBootstrap from 'angular-ui-bootstrap';

// import chartjs from 'chartjs';
// import angularChartjs from 'angular-chartjs';


/*@ngInject*/
angular.module('app', [uirouter, login, project, jwt, ngAnimate, taskrow, uiBootstrap])
	.run(root)
	.constant('API_URL','http://localhost:3000')
	.config(routing);


