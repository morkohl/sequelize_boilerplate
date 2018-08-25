const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const authController = require('../../controllers/auth.controller');
const {
    login,
    register
} = require('../../validation/auth.validation');

router.post('/login', validate(login), authController.login);
router.post('register', validate(login), authController.register);