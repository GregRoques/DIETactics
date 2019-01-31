var express = require('express');
var router = express.Router();

// custom middleware variables
const config = require('config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
  connection.connect();
const bcrpt = require('bcrypt-node.js');
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
