const db = require('../models/db');
const respondWithData = require('../utils').respondWithData;

exports.getUser = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.userId);
        respondWithData(res, user);
    } catch (err) {
        next(err);
    }
};

exports.getAll = async function (req, res, next) {
    try {
        const users = await db.User.findAll();
        respondWithData(res, users);
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
        respondWithData(res, updatedRows);
    } catch (err) {
        next(err);
    }
};