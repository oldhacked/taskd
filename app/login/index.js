
//LIBS
// import angularMoment from 'angular-moment';
//APP
import angular from 'angular';
import uirouter from 'angular-ui-router';
//STYLES
require('./login-pack/login.styles.scss');

//REGISTER
import routing from './login.routes';
	//controllers
import LoginCtrl from './login-pack/login.controller';

	//services

	//directives


  
export default angular.module('app.login', [uirouter])
  .config(routing)
  .controller('LoginCtrl', LoginCtrl)
  .name;
