require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', api);
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
module.exports = app;
