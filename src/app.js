const config = require('./config');
const express = require('express');
const logger = require('morgan');
const errorHandler = require('./api/middleware/error.middleware');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./api/routes/v1');

const models = require('./api/models/db');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.use('/api/v1', routes);

app.use(errorHandler.notFound);
app.use(errorHandler.converter);
app.use(errorHandler.handler);

models.sequelize.sync().then(() => {
    app.listen(config.port);
    console.log(`Server started on port: ${config.port}\nUsed environment: ${process.env.NODE_ENV}`)
});

module.exports = app;
