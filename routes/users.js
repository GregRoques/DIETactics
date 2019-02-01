var express = require('express');
var router = express.Router();
const config = require('../config');
const request = require("request");


/* GET users listing. */
router.get('/', function(req, res, next) {
 
  const sex = req.session.sex;
  const age = req.session.age;
  const weight = req.session.weight;
  const height = req.session.height;

  let totalCal
  if (sex == 'male'){
    totalCal = 864 - 9.72 * age + 1 * (14.2 * weight + 503 * height)
  }else{
  totalCal =  387 - 7.31 * age + 1 * (10.9 * weight + 660.7 * height)
  }

  console.log(totalCal)

  res.render("userHome", {});
  
});

module.exports = router;


