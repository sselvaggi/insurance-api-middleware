const express = require('express');
const NodeCache = require('node-cache');
const apiHelper = require('../helpers/ApiClient');

const xhr = require('../helpers/XHR');

const router = express.Router();
const cache = new NodeCache();

router.post('/login', async (req, res) => {
  const token = await apiHelper.login(cache, xhr);
  res.json({
    token,
    type: 'Bearer'
  });
});

router.get('/clients', async (req, res, next) => {
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

router.get('/clients/:id', async (req, res, next) => {
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
