const express = require ("express");
var api = express.Router();
const cors = require('cors')({
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

const itemController = require('../controllers/item.controller');

api.use('/items', [ ], (req, res) => {
  cors(req, res, () => {
    return itemController.getItemSearch(req, res);
  });
});

api.get('/item/:id', [ ], (req, res) => {
  cors(req, res, () => {
    return itemController.getItemId(req, res);
  });
});


module.exports = api;
