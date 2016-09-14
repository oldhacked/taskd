
export default ngModule => {

 
 

  ngModule.directive('kcdHello', function($log) {
    require('./base.scss');
    require('../crud/derp.scss');
    return {
      restrict: 'E',
      scope: {},
      template: require('./kcd-hello.html'),
      controllerAs: 'vm',
      controller: /*@ngInject*/ function() {
        const vm = this;

        vm.greeting = 'Hello Webpack';
        $log.info('I have some info');
        $(document).ready(function() {
          console.log("derp test2");
        });
      }
    };


  });





}
