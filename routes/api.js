const express = require ("express");
var api = express.Router();

const itemController = require('../controllers/item.controller');

api.use('/items', [ ], (req, res) => {
  return itemController.getItemSearch(req, res);
});

api.get('/item/:id', [ ], (req, res) => {
  return itemController.getItemId(req, res);
});


module.exports = api;
