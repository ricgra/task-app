const express = require('express');
const TaskController = require('../middleware/taskController');
const authentication = require('../middleware/authentication');


const router = new express.Router();

router.post('/tasks', authentication, TaskController.createUserTask);

router.patch('/tasks/:id', authentication, TaskController.updateUserTask);

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', authentication, TaskController.getUserTasks);

router.get('/tasks/:id', authentication, TaskController.getUserTaskById);

router.delete('/tasks/:id', authentication, TaskController.deleteUserTaskById);


module.exports = router;