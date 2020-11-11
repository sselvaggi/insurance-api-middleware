/// <reference path="../index.d.ts" />
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const NodeCache = require('node-cache');
const swaggerDocument = require('./openapi.json');
const middlewares = require('./middlewares');
const authRouter = require('./api/auth');
const clientsRouter = require('./api/clients');
const policiesRouter = require('./api/policies');
const ApiClientService = require('./services/ApiClient');
const xhr = require('./helpers/XHR');

const cache = new NodeCache();
const API = new ApiClientService(cache, xhr);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', authRouter(API));
app.use('/api/v1', clientsRouter(API));
app.use('/api/v1', policiesRouter(API));
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
module.exports = app;
