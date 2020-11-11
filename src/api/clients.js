/// <reference path="../../index.d.ts" />
const express = require('express');
const NodeCache = require('node-cache');
const { ResponseCodes } = require('http-headers-js');
const ApiClientService = require('../services/ApiClient');
const jwtCheck = require('../middlewares/JwtCheck');
const xhr = require('../helpers/XHR');
const { serializeClientPolicy, serializeClient } = require('../helpers/responses');

const cache = new NodeCache();
const API = new ApiClientService(cache, xhr);

module.exports = () => {
  const router = express.Router();

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
        return res.status(ResponseCodes.OK).json(clients.map(serializeClient));
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
          return res.status(ResponseCodes.OK).json(serializeClient(client));
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
          return res.status(ResponseCodes.OK).json(policies.map(serializeClientPolicy));
        }
        return res.sendStatus(ResponseCodes.UNAUTHORIZED);
      } catch (error) {
        return next(error);
      }
    });

  return router;
};
