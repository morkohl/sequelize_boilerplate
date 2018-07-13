const db = require('../models/modelSetup');
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

exports.createTask = async function (req, res, next) {

};

exports.getTask = async function (req, res, next) {
    try {
        //why dont we just query the fuckin data? lmao
        const task = await db.Task.findOne(
            {
                where: {}
            })
    }
};

exports.getUser = function (req, res, next) {

};

exports.getUser = function (req, res, next) {
    console.log(req.params.user_id);
    db.User.findById(req.params.user_id).then(res.send).catch(next);
};

exports.getAll = function (req, res, next) {
    db.User.all().then(res.send).catch(next);
};

exports.getAllTasks = function (req, res, next) {
    db.Tasks.findAll({where: {userId: req.params.user_id}}).then(res.send).catch(next);
};

exports.changeUser = function (req, res, next) {

};

exports.changeTask = function (req, res, next) {

};