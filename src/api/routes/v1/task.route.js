const express = require('express');
const router = express.Router();
const validate = require('../../validation/validate').validate;
const taskController = require('../../controllers/task.controller');
const APIError = require('../../utils/APIError');

const {
    create,
    change,
    userAndTaskParams,
    userParams
} = require('../../validation/task.validations');

router.post('/:userId/task', validate(create), taskController.createTask);

router.get('/:userId/task/', validate(userParams), taskController.getAllTasks);
router.get('/:userId/task/:taskId', validate(userAndTaskParams), taskController.getTask);

router.put('/:userId/task/:taskId', validate(change), taskController.changeTask);

module.exports = router;