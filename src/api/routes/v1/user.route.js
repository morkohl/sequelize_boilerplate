const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const userController = require('../../controllers/user.controller');

const {
    change,
    get
} = require('../../validation/user.validations');

router.get('/', userController.getAll());
router.get('/:userId', userController.getUser);

router.put('/:userId', validate(change), userController.changeUser);

module.exports = router;