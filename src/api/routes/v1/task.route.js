const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');

router.post('/:userId/task', taskController.createTask);

router.get('/:userId/task/', taskController.getAllTasks);
router.get('/:userId/task/:taskId', taskController.getTask);

router.put('/:userId/task/:taskId', taskController.changeTask);

