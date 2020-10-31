const Logger = require('./utils/logger');
const { connect: initDatabase } = require('./db/mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

initDatabase().then(() => {
    if (app.get('env') === 'test') return;
    app.listen(port, () => {
        Logger.info('Server is up on port [' + port + ']');
    })
})