var express = require('express');
var router = express.Router();

const request = require("request");


/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/profileCreation", (req,res,next)=>{
  res.render("profileCreation", {});
})

router.post("/userProfileCreation", (req,res,next)=>{
  const firstName = req.body.firstName;
  const age = req.body.age;
  const sex = req.body.sex;

// change height from inches to cm for purpose of db/api usage
  let heightFeet = parseInt(req.body.heightFeet);
  let heightInches = parseInt(req.body.heightInches);
  let heightTotalInches = (heightFeet * 12) + heightInches;

  const heightTotalCm = heightTotalInches * 2.54;

// change weight from pounds to kilograms
  let startingWeightLb = parseInt(req.body.startingWeight);
  const startingWeightKg = startingWeightLb * 0.453592;
  // console.log(startingWeightKg);
  let targetWeightLb = parseInt(req.body.targetWeight);
  const targetWeightKg = targetWeightLb * 0.453592;
  // console.log(targetWeightKg);
});

module.exports = router;