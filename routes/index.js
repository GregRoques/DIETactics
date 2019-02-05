var express = require('express');
var router = express.Router();


// custom middleware variables
const config = require('../config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);

connection.connect();
const bcrypt = require('bcrypt-nodejs');
const request = require('request');

const helmet = require('helmet');



/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect("/users");
  } else {
    res.render('index', {});
  }
});

module.exports = router;