const express = require('express');
const router = express.Router();
const validate = require('../../validation');
const taskController = require('../../controllers/task.controller');
const authenticate = require('../../middleware/auth.middleware');

const {
    create,
    update,
    userAndTaskParams,
    userParams
} = require('../../validation/task.validations');

router.post('/:userId/task', authenticate(), validate(create), taskController.create);

router.get('/:userId/task/', authenticate(), validate(userParams), taskController.getAll);
router.get('/:userId/task/:taskId', authenticate(), validate(userAndTaskParams), taskController.get);

router.put('/:userId/task/:taskId', authenticate(), validate(update), taskController.update);

module.exports = router;