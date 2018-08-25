const config = require('./config/config');
const express = require('express');
const logger = require('morgan');
const errorHandler = require('./api/middleware/error.middleware');
const helmet = require('helmet');

const routes = require('./api/routes/v1/index.route');

const models = require('./api/models/db');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use('/v1', routes);

app.use(errorHandler.notFound);
app.use(errorHandler.converter);
app.use(errorHandler.handler);

models.sequelize.sync().then(() => {
    app.listen(config.port);
});

module.exports = app;
