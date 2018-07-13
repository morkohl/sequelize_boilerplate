const express = require('express');
const path = require('path');
const logger = require('morgan');
const errorHandler = require('./api/middleware/error.middleware');

const routes = require('./api/routes/v1/index.route');

const models = require('./api/models/modelSetup');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', routes);

app.use(errorHandler.notFound);
app.use(errorHandler.converter);
app.use(errorHandler.handler);

models.sequelize.sync().then(() => {
    app.listen(8080);
});

module.exports = app;
