const express = require('express');
const router = express.Router({ mergeParams: true });
const validate = require('../../validation');
const taskController = require('../../controllers/task.controller');
const authenticate = require('../../middleware/auth.middleware');

const {
    create,
    update,
    userAndTaskParams,
    userParams
} = require('../../validation/task.validations');

router.post('/task', authenticate(), validate(create), taskController.create);

router.get('/task/', authenticate(), validate(userParams), taskController.getAll);
router.get('/task/:taskId', authenticate(), validate(userAndTaskParams), taskController.get);

router.put('/task/:taskId', authenticate(), validate(update), taskController.update);

router.delete('/task/:taskId', authenticate(), validate(userAndTaskParams), taskController.remove);

module.exports = router;