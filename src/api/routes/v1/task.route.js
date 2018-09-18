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

router.post('/:userId/task', validate(create), authenticate(), taskController.createTask);

router.get('/:userId/task/', validate(userParams), authenticate(), taskController.getAllTasks);
router.get('/:userId/task/:taskId', validate(userAndTaskParams), authenticate(), taskController.getTask);

router.put('/:userId/task/:taskId', validate(change), authenticate(), taskController.changeTask);

module.exports = router;