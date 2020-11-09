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

router.get('/clients', jwtCheck,
/**
 * @param {Insurance.SessionRequest} req
 * @param {Express.Response} res
 * @param {Function} next
 */
  async (req, res, next) => {
    try {
      const { email } = req.session;
      const { limit = 10, name, page = 1 } = req.query;
      const currentClient = await API.loadClientsByEmail(email);

      let clients;
      if (currentClient.role === 'admin') {
        clients = await API.loadClients();
        if (name) {
          clients = clients.filter(
            /** @param {Insurance.Client} client */
            (client) => client.name === name
          );
        }
        if (limit && clients.length > limit) {
          clients = clients.slice(limit * (page - 1), limit * page);
        }
      } else if (currentClient.role === 'user') {
        clients = [currentClient];
      } else {
        return res.sendStatus(ResponseCodes.UNAUTHORIZED);
      }
      return res.status(ResponseCodes.OK).json({ clients });
    } catch (error) {
      return next(error);
    }
  });

router.get('/clients/:id', jwtCheck,
/**
 * @param {Insurance.SessionRequest} req
 * @param {Express.Response} res
 * @param {Function} next
 */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (req.session.role === 'admin' || req.session.id === id) {
        const client = await API.loadClientById(id);
        return res.status(ResponseCodes.OK).json({ client });
      }
      return res.sendStatus(ResponseCodes.UNAUTHORIZED);
    } catch (error) {
      return next(error);
    }
  });

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

      return res.status(ResponseCodes.OK).json({ policies });
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
        return res.status(ResponseCodes.OK).json({ policy });
      }
      return res.sendStatus(ResponseCodes.UNAUTHORIZED);
    } catch (error) {
      return next(error);
    }
  });

router.get('/clients/:id/policies', jwtCheck,
/**
 * @param {Insurance.SessionRequest} req
 * @param {Express.Response} res
 * @param {Function} next
 */
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (req.session.role === 'admin' || req.session.id === id) {
        const policies = await API.loadPoliciesByClientId(id);
        return res.status(ResponseCodes.OK).json({ policies });
      }
      return res.sendStatus(ResponseCodes.UNAUTHORIZED);
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
