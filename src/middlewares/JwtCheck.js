const jwt = require('jsonwebtoken');
const { Headers, ResponseCodes } = require('http-headers-js');

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
module.exports = (req, res, next) => {
  const authHeader = req.header(Headers.AUTHORIZATION);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(ResponseCodes.UNAUTHORIZED);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(ResponseCodes.FORBIDDEN);
    req.session = data;
    return next();
  });
  return null;
};
