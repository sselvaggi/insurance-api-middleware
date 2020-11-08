const jwt = require('jsonwebtoken');
const { Headers, ResponseCodes } = require('http-headers-js');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authHeader = req.header(Headers.AUTHORIZATION);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(ResponseCodes.UNAUTHORIZED);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(ResponseCodes.FORBIDDEN);
    req.user = user;
    return next();
  });
};
