const mongoose = require('mongoose');
const Logger = require('../utils/logger');


const connectionUrl = process.env.MONGODB_URL;

Logger.info('Connecting to DB [ ' + connectionUrl + ' ]');

const connect = async () => {
    try {
        await mongoose.connect(connectionUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        Logger.info('Connected successfully');
    } catch (error) {
        throw new Error('Cannot connect to DB [' + error + ']');
    }
};

module.exports = {
    connect
};