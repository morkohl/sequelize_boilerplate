const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const userController = require('../../controllers/user.controller');

const {
    change,
    login,
    register
} = require('../../validation/user.validations');

router.post('/register', validate(register), userController.register);
router.post('/login', validate(login), userController.login);

router.get('/:userId', userController.getUser);

router.put('/:userId', validate(change), userController.changeUser);

module.exports = router;
