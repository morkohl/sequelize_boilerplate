const express = require('express');
const router = express.Router();
const resWithSuccess = require('../../utils/utils').resWithSuccess;

router.get('/', function(req, res, next) {
    resWithSuccess(res, {title: "sequelize boilerplate"});
});

module.exports = router;
