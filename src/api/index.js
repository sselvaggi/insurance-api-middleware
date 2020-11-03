const express = require('express');
const apiHelper = require('../helpers/insuranceApiClient');
const router = express.Router();

router.post('/login', async (req, res) => {
  const result = await apiHelper.login()
  res.json(result);
});

module.exports = router;
