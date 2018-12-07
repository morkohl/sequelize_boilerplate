const db = require('../models');
const httpStatus = require('http-status');
const { respondWithData, respondSuccess } = require('../utils');

exports.create = async function (req, res, next) {
    try {
        const task = await db.Task.create(req.body.task);
        return respondWithData(res, task, httpStatus.CREATED);
    } catch (err) {
        next(err);
    }
};

exports.get = async function (req, res, next) {
    try {
        const task = await db.Task.findOne(
            {
                where: {
                    id: req.params.taskId,
                    userId: req.params.userId
                }
            });
        return respondWithData(res, task)
    } catch (err) {
        next(err);
    }
};

exports.getAll = async function (req, res, next) {
    try {
        const tasks = await db.Task.findAll(
            {
                where: {
                    userId: req.params.userId
                }
            }
        );
        return respondWithData(res, tasks);
    } catch (err) {
        next(err);
    }
};

exports.update = async function (req, res, next) {
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
        return respondWithData(res, updatedRows)
    } catch (err) {
        next(err);
    }
};

exports.remove = async function (req, res, next) {
    try {
        await db.Task.destroy({
            where: {
                userId: req.params.userId,
                id: req.params.taskId
            }
        });
        return respondSuccess(res, httpStatus.NO_CONTENT);
    } catch(err) {
        next(err);
    }
};