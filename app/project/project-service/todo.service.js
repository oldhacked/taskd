import angular from 'angular';
/* @ngInject */
function todoService($http){

  var API_URL = 'http://localhost:3000';


  var getProjectStubs = function(uid, token){
    console.log("project stubs uid: " + uid);
    return $http({
      method : 'GET',
      url : API_URL + '/projects/stubs/'+ uid,
      headers : {
        'x-access-token' : token
      }
    });
  };

  var createNewProject = function(project, token) {
    console.log("project: " + project.title + " being sent by service");
    return $http({
      method : 'POST',
      url : API_URL + '/projects',
      headers : {
        'Content-Type': 'application/json',
        'x-access-token' : token
      },
      data : project
    });
  };



  var getProjectById = function(pid, token){
    console.log("project id: " + pid + "requested from server");
    return $http({
      method : 'GET',
      url : API_URL + '/projects/pbyid/'+ pid,
      headers : {
        'x-access-token' : token
      }
    });
  };



///////////////TODOS/////////////////////

var addTodo = function(todo, token) {
  console.log("sent new todo to pid: " + todo.pid);
  return $http({
    method : 'POST',
    url : API_URL + '/projects/todos',
    headers : {
      'Content-Type': 'application/json',
      'x-access-token' : token
    },
    data : todo
  })
};

var getTodos = function(pid, token){
  console.log("******************* pid: " + pid);
  return $http({
    method : 'GET',
    url : API_URL + '/projects/todos/'+ pid,
    headers : {
      'x-access-token' : token
    }
  })
};

var removeTodo = function(ptData, token) {
  return $http({
    method : 'DELETE',
    url : API_URL + '/projects/todos',
    headers : {
       'Content-Type' : 'application/json',
      'x-access-token' : token
    },
    data : ptData
  })
};

var updatetodo = function(todo, token) {
  return $http({
    method : 'PUT',
    url : API_URL + '/projects/todos',
    headers : {
      'Content-Type' : 'application/json',
      'x-access-token' : token
    },
    data : todo
  })
};
return {

  getProjectStubs: getProjectStubs,
  createNewProject: createNewProject,
  getProjectById: getProjectById,

  removeTodo: removeTodo,
  getTodos: getTodos,
  addTodo: addTodo,
  updatetodo: updatetodo
};
}

todoService.$inject = ['$http'];

export default angular.module('todoService', [])
.factory('todoService', todoService)
.constant('API_URL','http://localhost:3000')
.name;

//   import angular from 'angular';

// /* @ngInject */
// function authService($window, $http){

// }

// authService.$inject = ['$window', '$http'];

// export default angular.module('jwt', [])
//   .constant('API_URL', 'http://localhost:3000')
//   .factory('authService', authService)
//   .name;