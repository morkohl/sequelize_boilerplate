const jwt = require('jsonwebtoken');
const cert = "TEST" | "PROD";
const db = require('../models');

module.exports = function authenticate(req, res, next) {
    if (req.)
};

const decode = function (req, res, next) {
    const accessHeader = req.headers["x-access-token"];
    const refreshHeader = req.headers["x-refresh-token"];

    if(accessHeader && refreshHeader) {
        req.accessToken = accessHeader.split(' ')[1];
        req.refreshToken = refreshHeader;

    }
};

//check refresh token and generate new acceess token. else onRefreshTokenExpired
const onAccessTokenExpired = function (req, res, next) {

};

//check if refreshToken disabled in database. if not generate new refreshtoken. else send error
const onRefreshTokenExpired = function (req, res, next) {

};

//create a new access or refresh token
const createNewToken = function(req, res, next) {

};

//set the new tokens
const setHeaders = function(req, res, next) {

};

//get the corresponding user
const getUser = function () {

};