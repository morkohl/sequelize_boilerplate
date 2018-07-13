const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/:user_id/task', controller.createTask);

router.get('/:user_id', controller.getUser);
router.get('/:user_id/task/', controller.getTask);
router.get('/:user_id/task/:task_id', controller.getTask);

router.put('/:user_id', controller.changeUser);
router.put('/:user_id/task/:task_id', controller.changeTask);

module.exports = router;
