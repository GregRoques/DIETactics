var express = require('express');
var router = express.Router();
const config = require('../config');
const request = require("request");

const apiBaseUrl = "https://trackapi.nutritionix.com/";

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

  res.render("dailyInput", {});
});

router.post("/dailyProgress", (req,res,next)=>{
  const date = req.body.date;
  const breakfast = req.body.breakfast;
  const lunch = req.body.lunch;
  const dinner = req.body.dinner;
  const other = req.body.other;

  const searchUrl = `${apiBaseUrl}/v2/natural/nutrients/`;
  const headers = {
    "content-Type": "application/json", 
    "x-app-id" :`${config.apiAppId}`, 
    "x-app-key":`${config.apiKey}`, 
    "x-remote-user-id":`${config.activeUser}`
  };

  const options = {"query": `${breakfast} + ${lunch} + ${dinner} + ${other}`};
  console.log (options)
// console.log(headers);
  request.post({url: searchUrl, headers: headers, body: JSON.stringify(options)},(error,res,body)=>{
    const parsedData = JSON.parse(body);
    const foodArray = parsedData.foods;
    let totalCalories = 0;
    for(let i = 0; i < foodArray.length; i++){
      totalCalories += foodArray[i].nf_calories;
      console.log(foodArray[i].food_name, foodArray[i].nf_calories)
    }
    console.log(totalCalories);
  });
});

module.exports = router;


