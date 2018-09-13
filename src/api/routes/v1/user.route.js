const express = require('express');
const router = express.Router();
const validate = require('../../validation/validate').validate;
const userController = require('../../controllers/user.controller');

const passport = require('passport');

const {
    change,
    userParams
} = require('../../validation/user.validations');

router.get('/', userController.getAll);
router.get('/:userId', validate(userParams), userController.getUser);

router.put('/:userId', validate(change), passport.authenticate('jwt', {session: false}), userController.changeUser);

module.exports = router;