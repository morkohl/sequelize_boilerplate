const db = require('../models/');
const httpStatus = require('http-status');
const resWithSuccess = require('../utils/utils').resWithSuccess;
const APIError = require('../utils/APIError');

exports.register = async function (req, res, next) {
    try {
        const result = db.User.findOrCreate({
            where: {
                username: req.body.user.username,
                email: req.body.user.email
            }
        });
        const user = result[0];
        const created = result[1];
        if (created) {
            return resWithSuccess(res, user, httpStatus.CREATED);
        }
        next(new APIError({
            message: "User already registered"
        }));
    } catch (err) {
        next(err);
    }
};

exports.login = async function (req, res, next) {
    try {
        const user = await db.User.findOne(
            {
                where: {
                    username: req.body.user.username
                }
            });
        if (user) {
            const validPassword = await user.validPassword(req.body.user.password);
            if (validPassword) {
                return res.sendStatus(httpStatus.OK);
            }
        }
        next(new APIError({
            message: !validPassword ? "Invalid login" : "User doesn't exist",
            status: httpStatus.UNAUTHORIZED
        }))
    } catch (err) {
        next(err);
    }
};

exports.getUser = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.body.user.id);
        resWithSuccess(res, user);
    } catch (err) {
        next(err);
    }
};

exports.getAll = async function (req, res, next) {
    try {
        const users = await db.User.findAll();
        resWithSuccess(res, users);
    } catch (err) {
        next(err);
    }
};

exports.changeUser = async function (req, res, next) {
    try {
        const updatedRows = await db.User.update(
            {
                where: {
                    id: req.params.userId
                }
            });
        resWithSuccess(res, updatedRows);
    } catch (err) {
        next(err);
    }
};

