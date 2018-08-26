const express = require('express');
const router = express.Router();
const validate = require('../../validation/validate').validate;
const userController = require('../../controllers/user.controller');

const {
    change,
} = require('../../validation/user.validations');

router.get('/', userController.getAll);
router.get('/:userId', userController.getUser);

router.put('/:userId', validate(change), userController.changeUser);

module.exports = router;