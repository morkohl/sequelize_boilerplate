const db = require('../models/db');
const resWithSuccess = require('../utils/utils').resWithSuccess;

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