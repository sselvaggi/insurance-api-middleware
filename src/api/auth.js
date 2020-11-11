/// <reference path="../../index.d.ts" />
const express = require('express');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const { ResponseCodes } = require('http-headers-js');
const ApiClientService = require('../services/ApiClient');
const jwtCheck = require('../middlewares/JwtCheck');
const xhr = require('../helpers/XHR');

const { ACCESS_TOKEN_SECRET } = process.env;
const cache = new NodeCache();
const API = new ApiClientService(cache, xhr);

module.exports = () => {
  const router = express.Router();
  router.post('/login',
    /**
     * @param {Insurance.SessionRequest} req
     * @param {Express.Response} res
     */
    async (req, res) => {
      const { username } = req.body;
      try {
        const client = await API.loadClientsByEmail(username);
        if (client) {
          const token = jwt.sign(client, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
          return res.status(ResponseCodes.OK).json({ token, type: 'Bearer' });
        }
        return res.sendStatus(ResponseCodes.FORBIDDEN);
      } catch (error) {
        return res.sendStatus(ResponseCodes.FORBIDDEN);
      }
    });

  return router;
};
