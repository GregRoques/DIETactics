var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt-nodejs");
const mysql = require("mysql");
const config = require("../config");

const helmet = require('helmet');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;