const express = require('express');
const router = express.Router();
const validate = require('../../validation');
const userController = require('../../controllers/user.controller');
const authenticate = require('../../middleware/auth.middleware');

const {
    change,
    userParams
} = require('../../validation/user.validations');

router.get('/', authenticate(), userController.getAll);
router.get('/:userId', authenticate(), validate(userParams), userController.getUser);

router.put('/:userId', authenticate(), validate(change), userController.changeUser);

module.exports = router;