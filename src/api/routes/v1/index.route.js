const express = require('express');
const router = express.Router();
const respondWithData = require('../../utils/utils').respondWithData;

router.get('/', function (req, res) {
    respondWithData(res, {title: "sequelize boilerplate"});
});

module.exports = router;