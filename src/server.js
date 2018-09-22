const config = require('./config');
const db = require('./api/models');
const expressApp = require('./config/express');

db.sequelize.sync().then(() => {
    console.log('Synced database');
});

const server = expressApp.listen(config.port, () => {
    console.log(`Server started on port: ${config.port}\nUsed environment: ${process.env.NODE_ENV}`);
    server.emit('started');
});

module.exports = server;