var express = require('express');
var projectCtrl = require('../controllers/projectCtrl');
var router = express.Router();

//AUTHENTICATOR
var ctrl = require('../user/authenticator.js');
router.use(ctrl.jwtAuthenticator);

//TODOS
router.get('/todos/:pid', projectCtrl.getAllTodos);
router.post('/todos', projectCtrl.insertTodo);
router.put('/todos', projectCtrl.updateTodo);
router.delete('/todos', projectCtrl.destroyTodo);

//PROJECT
router.post('/', projectCtrl.newProject);
router.get('/:uid', projectCtrl.getAllProjects);
router.get('/stubs/:uid', projectCtrl.getAllProjectStubs);
router.get('/pbyid/:pid', projectCtrl.getProjectById);
router.delete('/:pid', projectCtrl.destroyProject);
router.put('/', projectCtrl.updateProject);

module.exports = router;

