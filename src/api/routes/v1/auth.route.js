const express = require('express');
const router = express.Router();
const validate = require('../../validation');
const authController = require('../../controllers/auth.controller');
const authenticate = require('../../middleware/auth.middleware');
const {
    refresh,
    login,
    register
} = require('../../validation/auth.validation');

router.get('/logout', authenticate(), authController.logout);

router.post('/refresh', validate(refresh), authController.refresh);
router.post('/login', validate(login), authController.login);
router.post('/register', validate(register), authController.register);


module.exports = router;