const express = require('express');
const router = express.Router();
const validate = require('../../validation');
const taskController = require('../../controllers/task.controller');
const authenticate = require('../../middleware/auth.middleware');

const {
    create,
    change,
    userAndTaskParams,
    userParams
} = require('../../validation/task.validations');

router.post('/:userId/task', authenticate(), validate(create), taskController.createTask);

router.get('/:userId/task/', authenticate(), validate(userParams), taskController.getAllTasks);
router.get('/:userId/task/:taskId', authenticate(), validate(userAndTaskParams), taskController.getTask);

router.put('/:userId/task/:taskId', authenticate(), validate(change), taskController.changeTask);

module.exports = router;