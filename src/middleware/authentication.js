const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Logger = require('../utils/logger');

const auth = async (req, res, next) => {
    Logger.debug('Authenticate user');
    try {
        if (!req.header('Authorization')) {
            throw new Error('Authorization header not found');
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: tokenDecoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error('User not found, invalid token');
        }
        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        Logger.error(e);
        e.statusCode = 401;
        e.message = 'Please authenticate';
        next(e);
    }
};

module.exports = auth;