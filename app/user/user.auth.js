import angular from 'angular';

/* @ngInject */
function authService($window, $http){
  const API_URL = 'http://localhost:3000';
  var store = $window.localStorage;
  var key = 'auth-token';
  console.log(store);
  var storage = {
    get: function(){
      return store.getItem(key);
    },
    set: function (token){
      if(token){
        store.setItem(key, token);
      }else {
        store.removeItem(key);
      }
    }
  };

  var getToken = function(){
    return storage.get();
  }
  var tester = function(num){
    return num * num;
  };
  var signup = function(username, password){
    console.log(username, password);
    return $http.post(API_URL + '/user/signup', {
      username: username,
      password: password
    }).then(function success(response){
      console.log(response.data.token);
      storage.set(response.data.token);
      return response;
    });

  };
  var login = function(username, password){
    console.log("verifying");
    return $http.post(API_URL + '/user/login', {
      username: username,
      password: password
    }).then(function success(response){
      console.log(response.data.token);
      storage.set(response.data.token);
      return response;
    })
  };

  var logout = function(){
    storage.set();
  };
    // Check that a user's login is valid (present AND not expired)
    var isLoggedIn = function() {
      var token = storage.get();

      if (token) {
        // $window.atob decodes the encoded string
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;

      } else {
        return false;
      }
    };

    // Get current user from JWT
    var currentUser = function() {
      if (isLoggedIn()) {
        var token = storage.get();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return {
          username : payload.username,
          _id : payload._id
        };
      }
    };

    return {
      tester : tester,
      signup : signup,
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser,
      getToken : getToken
    }
  };

authService.$inject = ['$window', '$http'];

export default angular.module('jwt', [])
  .constant('API_URL', 'http://localhost:3000')
  .factory('authService', authService)
  .name;















