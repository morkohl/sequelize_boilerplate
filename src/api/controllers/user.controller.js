const db = require('../models/');
const httpStatus = require('http-status');

exports.register = async function (req, res, next) {
    try {
        const resultArray = db.User.findOrCreate({
            where: {
                username: req.body.user.username,
                email: req.body.user.email
            }
        });
        const user = resultArray[0];
        const created = resultArray[1];
        if (created) {
            res.status(httpStatus.CREATED).send(user);
        } else {
            res.sendStatus(httpStatus.CONFLICT);
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async function (req, res, next) {
    try {
        const user = await db.User.findOne(
            {
                where: {
                    username: req.body.username

                }
            });
        if (user) {
            const validPassword = await user.validPassword(req.body.user.password);
            if (validPassword) {
                return res.sendStatus(httpStatus.OK);
            }
        }
        res.sendStatus(httpStatus.UNAUTHORIZED);
    } catch (error) {
        next(error);
    }
};

exports.getUser = function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};

exports.getUser = function (req, res, next) {
    db.User.findById(req.params.userId).then(res.send).catch(next);
};

exports.getAll = function (req, res, next) {
    db.User.all().then(res.send).catch(next);
};

exports.changeUser = function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};

