const express = require('express');
const logger = require('morgan');
const errorHandler = require('../api/middleware/error.middleware');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('../api/routes/v1/index');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.use('/api/v1', routes);

app.use(errorHandler.notFound);
app.use(errorHandler.logError);
app.use(errorHandler.handler);

module.exports = app;
