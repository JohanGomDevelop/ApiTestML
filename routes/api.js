const express = require ("express");
var api = express.Router();

const itemController = require('../controllers/item.controller');


api.get('/items/:id', [ ], (req, res) => {
  return itemController.getItemId(req, res);
});

module.exports = api;
