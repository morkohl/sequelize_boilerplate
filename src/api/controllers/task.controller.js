const db = require('../models');
const httpStatus = require('http-status');
const respondWithData = require('../utils').respondWithData;

exports.createTask = async function (req, res, next) {
    try {
        const task = await db.Task.create(req.body.task);
        return await respondWithData(res, task, httpStatus.CREATED);
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
        return await respondWithData(res, task)
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
        await respondWithData(res, tasks);
    } catch (err) {
        next(err);
    }
};

exports.changeTask = async function (req, res, next) {
    try {
        const updatedRows = await db.Task.update(
            req.body.task,
            {
                where: {
                    userId: req.params.userId,
                    id: req.params.taskId
                }
            }
        );
        await respondWithData(res, updatedRows)
    } catch (err) {
        next(err);
    }
};
