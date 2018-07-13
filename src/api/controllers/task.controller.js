const db = require('../models/');
const httpStatus = require('http-status');

exports.createTask = async function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};

exports.getTask = async function (req, res, next) {
    try {
        //why dont we just query the fuckin data? lmao
        const task = await db.Task.findOne(
            {
                where: {
                    id: req.params.taskId,
                    userId: req.params.userId
                }
            });
        if (task) {
            return res.status(httpStatus.OK).send(task);
        }
        res.status(httpStatus.NOT_FOUND);
    } catch (err) {
        next(err);
    }
};

exports.getAllTasks = async function (req, res, next) {
    try {
        const tasks = db.Task.findAll(
            {
                where: {
                    userId: req.params.userId
                }
            }
        );
        res.status(200).send(tasks);
    } catch (err) {
        next(err);
    }
};

exports.changeTask = async function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};

exports.createTask = async function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};