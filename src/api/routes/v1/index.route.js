const express = require('express');
const router = express.Router();
const resWithSuccess = require('../../utils/utils').resWithSuccess;
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    resWithSuccess(res, {title: "sequelize boilerplate"});
});

module.exports = router;

async function add(a, b) {
    return a + b;
}