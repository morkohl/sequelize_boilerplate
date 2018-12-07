const express = require('express');
const router = express.Router();
const validate = require('../../validation');
const userController = require('../../controllers/user.controller');
const authenticate = require('../../middleware/auth.middleware');

const {
    update,
    userParams
} = require('../../validation/user.validations');

router.get('/', authenticate(), userController.getAll);
router.get('/:userId', authenticate(), validate(userParams), userController.get);

router.put('/:userId', authenticate(), validate(update), userController.update);

module.exports = router;