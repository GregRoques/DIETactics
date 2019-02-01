var express = require('express');
var router = express.Router();

const request = require("request");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("userHome", {});
});

module.exports = router;