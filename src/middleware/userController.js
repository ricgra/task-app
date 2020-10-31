const User = require('../models/user');
const Logger = require('../utils/logger');


exports.create = async (req, res, next) => {
    Logger.info('Create new user');
    try {
        await checkUserAlreadyExist(req.body.email);
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        e.statusCode = 400;
        next(e);
    }
};

exports.login = async (req, res, next) => {
    Logger.info('Login user');
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (e) {
        e.statusCode = 400;
        next(e);
    }
};

exports.logout = async (req, res, next) => {
    Logger.info('Logout user');
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return req.token !== token.token;
        });
        await req.user.save();

        res.send();
    } catch (e) {
        e.statusCode = 500;
        next(e);
    }
};

exports.logoutAll = async (req, res, next) => {
    Logger.info('Delete all user tokens');
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        e.statusCode = 500;
        next(e);
    }
};

exports.getLoggedUser = async (req, res) => {
    Logger.info('Get logged user');
    res.send(req.user);
};

exports.updateLoggedUser = async (req, res, next) => {
    Logger.info('Update user fields');
    try {
        const updates = Object.keys(req.body);
        isValidOperation = updates.every((update) => {
            return User.allowedUpdates.includes(update);
        })
        if (!isValidOperation) {
            return res.status(500).send({ error: 'Invalid updates fields' });
        }
        await checkUserAlreadyExist(req.body.email);
        // Update user fields before save
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        e.statusCode = 400;
        next(e);
    }
};

exports.deleteLoggedUser = async (req, res, next) => {
    try {
        await req.user.remove();

        res.send(req.user);
    } catch (e) {
        e.statusCode = 400;
        next(e);
    }
};

const checkUserAlreadyExist = async (email) => {
    const dbUser = await User.findOne({ email });
    if (dbUser) {
        throw new Error('Email already in use');
    }
};