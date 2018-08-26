const express = require('express');
const router = express.Router();
const validate = require('../../validation/validate').validate;
const taskController = require('../../controllers/task.controller');

const {
    create,
    change
} = require('../../validation/task.validations');

router.post('/:userId/task', validate(create), taskController.createTask);

router.get('/:userId/task/', taskController.getAllTasks);
router.get('/:userId/task/:taskId', taskController.getTask);

router.put('/:userId/task/:taskId', validate(change), taskController.changeTask);

module.exports = router;