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
router.get('/:userId', validate(userParams), authenticate(), userController.getUser);

router.put('/:userId', validate(change), authenticate(), userController.changeUser);

module.exports = router;