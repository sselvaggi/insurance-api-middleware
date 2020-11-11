/// <reference path="../../index.d.ts" />
const express = require('express');
const NodeCache = require('node-cache');
const { ResponseCodes } = require('http-headers-js');
const ApiClientService = require('../services/ApiClient');
const jwtCheck = require('../middlewares/JwtCheck');
const xhr = require('../helpers/XHR');
const { serializePolicy } = require('../helpers/responses');

const cache = new NodeCache();
const API = new ApiClientService(cache, xhr);

module.exports = () => {
  const router = express.Router();
  router.get('/policies', jwtCheck,
  /**
   * @param {Insurance.SessionRequest} req
   * @param {Express.Response} res
   * @param {Function} next
   */
    async (req, res, next) => {
      try {
        const { limit = 10, page = 1 } = req.query;

        let policies;
        if (req.session.role === 'admin') {
          policies = await API.loadPolicies();
        } else if (req.session.role === 'user') {
          policies = await API.loadPoliciesByClientId(req.session.id);
        } else {
          res.sendStatus(ResponseCodes.UNAUTHORIZED);
        }

        if (limit && policies.length > limit) {
          policies = policies.slice(limit * (page - 1), limit * page);
        }

        return res.status(ResponseCodes.OK).json(policies.map(serializePolicy));
      } catch (error) {
        return next(error);
      }
    });

  router.get('/policies/:id', jwtCheck,
  /**
   * @param {Insurance.SessionRequest} req
   * @param {Express.Response} res
   * @param {Function} next
   */
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const policy = /** @type {Insurance.Policy} */ (await API.loadPolicieById(id));
        if (req.session.role === 'admin' || policy.clientId === req.session.id) {
          return res.status(ResponseCodes.OK).json(serializePolicy(policy));
        }
        return res.sendStatus(ResponseCodes.UNAUTHORIZED);
      } catch (error) {
        return next(error);
      }
    });

  return router;
};
