const Task = require('../models/task');
const Logger = require('../utils/logger');


exports.createUserTask = async (req, res, next) => {
    Logger.info('Create a new task');
    try {
        const task = new Task({
            // Copy all fields
            ...req.body,
            owner: req.user._id
        });
        const newTask = await task.save();

        res.status(201).send(newTask);
    } catch (e) {
        e.statusCode = 500;
        next(e);
    }
};

exports.updateUserTask = async (req, res, next) => {
    Logger.info('Update task [' + req.params.id + ']');
    try {
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((item) => Task.allowedUpdates.includes(item));
        if (!isValidOperation) {
            return res.status(400).send({
                error: 'Invalid update fields'
            });
        }
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({
                error: 'No task to update'
            });
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        e.statusCode = 400;
        next(e);
    }
};

exports.getUserTasks = async (req, res, next) => {
    Logger.info('Get user tasks');
    try {
        const match = {};
        const completed = req.query.completed;
        if (completed) {
            match.completed = completed === 'true';
        }
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip,
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (e) {
        e.statusCode = 500;
        next(e);
    }
};

exports.getUserTaskById = (req, res, next) => {
    const _id = req.params.id;
    Logger.info('Get user task [' + _id + ']');

    Task.findOne({ _id, owner: req.user._id }).then((task) => {
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    }).catch((e) => {
        e.statusCode = 500;
        next(e);
    })
};

exports.deleteUserTaskById = async (req, res, next) => {
    Logger.info('Delete user task [' + req.params.id + ']');
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({
                error: 'Task not found'
            });
        }

        res.send(task);
    } catch (e) {
        e.statusCode = 500;
        next(e);
    }
};