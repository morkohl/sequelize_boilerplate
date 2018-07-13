const db = require('../models/');
const httpStatus = require('http-status');
const resWithSuccess = require('../utils/utils').resWithSuccess;

exports.createTask = async function (req, res, next) {
    try {
        const task = await db.Task.create(req.body.task);
        return resWithSuccess(res, task, httpStatus.CREATED);
    } catch (err) {
        next(err);
    }
};

exports.getTask = async function (req, res, next) {
    try {
        const task = await db.Task.findOne(
            {
                where: {
                    id: req.params.taskId,
                    userId: req.params.userId
                }
            });
        resWithSuccess(res, task)
    } catch (err) {
        next(err);
    }
};

exports.getAllTasks = async function (req, res, next) {
    try {
        const tasks = await db.Task.findAll(
            {
                where: {
                    userId: req.params.userId
                }
            }
        );
        resWithSuccess(res, tasks);
    } catch (err) {
        next(err);
    }
};

exports.changeTask = async function (req, res, next) {
    res.send(httpStatus.NOT_IMPLEMENTED);
};
