const express = require('express');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const apiHelper = require('../helpers/ApiClient');
const jwtCheck = require('../middlewares/JwtCheck');
const xhr = require('../helpers/XHR');

const router = express.Router();
const cache = new NodeCache();

router.post('/login', async (req, res) => {
  const { client_id, client_secret } = req.body;
  try {
    if (
      client_id === process.env.PUBLIC_API_ID
      && client_secret === process.env.PUBLIC_API_SECRET
    ) {
      const token = jwt.sign('public-api', process.env.ACCESS_TOKEN_SECRET); // , { expiresIn: '24h' }
      return res.status(200).json({ token, type: 'Bearer' });
    }
    return res.sendStatus(403);
  } catch (error) {
    return res.sendStatus(403);
  }
});

router.get('/clients', jwtCheck, async (req, res, next) => {
  try {
    const { limit, name } = req.query;
    const data = await apiHelper.loadData('/clients', cache, xhr);
    const result = name ? data.filter((client) => client.name === name) : data;
    return res.status(200).json({
      clients: result.slice(0, limit)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/clients/:id', jwtCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await apiHelper.loadData('/clients', cache, xhr);
    return res.status(200).json({
      client: data.find((client) => client.id === id)
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
