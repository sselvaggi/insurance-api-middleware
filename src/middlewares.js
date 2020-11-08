const { ResponseCodes } = require('http-headers-js');

function notFound(req, res, next) {
  res.status(ResponseCodes.NOT_FOUND);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== ResponseCodes.OK
    ? res.statusCode : ResponseCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  notFound,
  errorHandler
};
