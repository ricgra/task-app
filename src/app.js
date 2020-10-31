const express = require('express');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const Logger = require('./utils/logger');


const app = express();

// Auto parse incoming json
app.use(express.json());

// Register router
app.use(userRouter);
app.use(taskRouter);

app.use(function (err, req, res, next) {
    Logger.error(err);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send({ error: err.message });
})

module.exports = app;