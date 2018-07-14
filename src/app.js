const express = require('express');
<<<<<<< HEAD
=======
const path = require('path');
>>>>>>> e10cccc389e0a8145b18b91d79c3c687ed8b2f44
const logger = require('morgan');
const errorHandler = require('./api/middleware/error.middleware');

const routes = require('./api/routes/v1/index.route');

const models = require('./api/models/db');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1', routes);

app.use(errorHandler.notFound);
app.use(errorHandler.converter);
app.use(errorHandler.handler);

models.sequelize.sync().then(() => {
    app.listen(8080);
});

module.exports = app;
