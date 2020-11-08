/// <reference path="../../index.d.ts" />
const express = require('express');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const { ResponseCodes } = require('http-headers-js');
const apiHelper = require('../helpers/ApiClient');
const jwtCheck = require('../middlewares/JwtCheck');
const xhr = require('../helpers/XHR');

const { PUBLIC_API_ID, PUBLIC_API_SECRET, ACCESS_TOKEN_SECRET } = process.env;
const router = express.Router();
const cache = new NodeCache();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === PUBLIC_API_ID && password === PUBLIC_API_SECRET) {
      const token = jwt.sign({ user: 'public-api' }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
      return res.status(ResponseCodes.OK).json({ token, type: 'Bearer' });
    }
    return res.sendStatus(ResponseCodes.FORBIDDEN);
  } catch (error) {
    return res.sendStatus(ResponseCodes.FORBIDDEN);
  }
});

router.get('/clients', jwtCheck, async (req, res, next) => {
  try {
    const { limit = 10, name, page = 1 } = req.query;
    let clients = await apiHelper.loadData('/clients', cache, xhr);

    if (name) {
      clients = clients.filter((client) => client.name === name);
    }
    if (limit && clients.length > limit) {
      clients = clients.slice(limit * (page - 1), limit * page);
    }
    return res.status(ResponseCodes.OK).json({ clients });
  } catch (error) {
    return next(error);
  }
});

router.get('/clients/:id', jwtCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await apiHelper.loadData('/clients', cache, xhr);
    return res.status(ResponseCodes.OK).json({
      client: data.find((client) => client.id === id)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/policies', jwtCheck, async (req, res, next) => {
  try {
    const { limit = 10, name, page = 1 } = req.query;
    let policies = await apiHelper.loadData('/policies', cache, xhr);

    if (name) {
      policies = policies.filter((policy) => policy.name === name);
    }
    if (limit && policies.length > limit) {
      policies = policies.slice(limit * (page - 1), limit * page);
    }
    return res.status(ResponseCodes.OK).json({ policies });
  } catch (error) {
    return next(error);
  }
});

router.get('/policies/:id', jwtCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await apiHelper.loadData('/policies', cache, xhr);
    return res.status(ResponseCodes.OK).json({
      policy: data.find((policy) => policy.id === id)
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
