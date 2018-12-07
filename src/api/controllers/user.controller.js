const db = require('../models');
const httpStatus = require('http-status');
const {respondWithData, respondSuccess} = require('../utils');

exports.get = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.userId);
        return respondWithData(res, user);
    } catch (err) {
        next(err);
    }
};

exports.getAll = async function (req, res, next) {
    try {
        const users = await db.User.findAll();
        return respondWithData(res, users);
    } catch (err) {
        next(err);
    }
};

exports.update = async function (req, res, next) {
    try {
        await db.User.update(
            req.body.user,
            {
                where: {
                    id: req.params.userId
                },
            });
        const updatedUser = await db.User.findById(req.params.userId);
        return respondWithData(res, updatedUser);
    } catch (err) {
        next(err);
    }
};

exports.remove = async function (req, res, next) {
    try {
        await db.User.destroy({
            where: {
                id: req.params.userId
            }
        });
        return respondSuccess(res, httpStatus.NO_CONTENT);
    } catch (err) {
        next(err);
    }
};