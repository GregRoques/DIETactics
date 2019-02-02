var express = require('express');
var router = express.Router();
const config = require('../config');
const request = require("request");

const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
connection.connect();

const apiBaseUrl = "https://trackapi.nutritionix.com/";

/* GET users listing. */
router.get('/', function(req, res, next) {

  const sex = req.session.sex;
  const age = req.session.age;
  const weight = req.session.startingWeight;
  const height = req.session.height;
 
  // Calculate Cal-per-day-per-user using the Harris–Benedict_equation. Read More here: https://bit.ly/1I9tmyJ;
  let userCal = 0
  if (sex == 'male'){
    userCal = (Math.round(10 * weight) + (6.25 * height) - (5 * age) + 5);
  }else{
    userCal = (Math.round(10 * weight) + (6.25 * height) - (5 * age) - 161);
  }
  console.log('Harris-Benedict User Calorie Count')
  console.log(userCal)

  res.render("dailyInput", {});
});

router.post("/dailyProgress", (req,res,next)=>{
  const date = req.body.date;
  console.log(date)
  const breakfast = req.body.breakfast;
  const lunch = req.body.lunch;
  const dinner = req.body.dinner;
  const other = req.body.other;
  const id = req.session.uid;
  const dailyWeight = req.body.dailyWeight;

  const searchUrl = `${apiBaseUrl}/v2/natural/nutrients/`;
  const headers = {
    "content-Type": "application/json", 
    "x-app-id" :`${config.apiAppId}`, 
    "x-app-key":`${config.apiKey}`, 
    "x-remote-user-id":`${config.activeUser}`
  };

  const options = {"query": `${breakfast} + ${lunch} + ${dinner} + ${other}`};
  // console.log (options)
  // console.log(headers);
  request.post({url: searchUrl, headers: headers, body: JSON.stringify(options)},(error,res,body)=>{
    const parsedData = JSON.parse(body);
    const foodArray = parsedData.foods;
    let totalCalories = 0;
    for(let i = 0; i < foodArray.length; i++){
      totalCalories += foodArray[i].nf_calories;
      // console.log(foodArray[i].food_name, foodArray[i].nf_calories)
      
    }
    const insertUserQuery = `INSERT INTO userProgress (dailyWeight,date,calories,userID)
        VALUES
        (?,?,?,?);`;
        connection.query(insertUserQuery,[dailyWeight,date,totalCalories,id],(error, results)=>{
            if(error){throw error};
    });
  });
});

router.get("/weeklyProgress", (req,res,next)=>{
  let userDates = [];
  let userWeightProgress = [];
  const userProgressQuery = `SELECT date, dailyWeight, userId FROM userProgress
  ORDER BY date
  LIKE userId = ?;`
  connection.query(userProgressQuery,[req.session.id],(error, results)=>{
    if(error){throw error};
    let userInformationArray = results;
    for(let i = 0; i < userInformationArray.length; i++){
      userDates.push(userInformationArray[i].date);
      userWeightProgress.push(userInformationArray[i].dailyWeight)
    }
    let data = {
      userDates : userDates,
      userWeightProgress: userWeightProgress
    };

    res.render("weeklyProgress", {data});
  });
});

router.get("/profile",(req,res,next)=>{
  const userId = req.session.id;
  const selectUserProfileQuery = `SELECT * FROM userProfileInfo
  WHERE id = ?`;

  connection.query(selectUserProfileQuery,[userId],(err,results)=>{
    if(err){throw err};

    let msg;
    res.render('profile',{msg});
  });
});

router.post('/profileEdit',(req,res,next)=>{
  // Name, Age, Sex, Id
  const editFirstName = req.body.firstName;
  const editAge = req.body.age;
  const editSex = req.body.sex;
  const userId = req.session.id;

  // Height
  let editHeightFeet = parseInt(req.body.heightFeet);
  let editHeightInches = parseInt(req.body.heightInches);
  let editHeightTotalInches = (editHeightFeet * 12) + editHeightInches;
  const editHeighTotalCm = editHeightTotalInches * 2.54;

  // Weight
  let editStartWeightLb = parseInt(req.body.startingWeight);
  const editStartWeightKg = editStartWeightLb * 0.453592;
  let editTargetWeightLb = parseInt(req.body.targetWeight);
  const editTargetWeightKg = editTargetWeightLb * 0.453592;

  // Password & Edit Queries
  const passWord = req.body.passWord;
  const checkPasswordQuery = `SELECT * FROM userProfileInfo WHERE id = ?`;
  const editUserQuery = `UPDATE userProfileInfo
    SET firstName = ?, age = ?, sex = ?, height = ?, startingWeight = ?, targetWeight = ?
    WHERE id = ?`;

  connection.query(checkPasswordQuery,[userId],(err, results)=>{
    if(err){throw err;}

    const passwordsMatch = bcrypt.compareSync(passWord,results[0].hash)
    if(passwordsMatch){
      connection.query(editUserQuery,[editFirstName,editAge,editSex,editHeighTotalCm,editStartWeightKg,editTargetWeightKg,userId],(err_2,results)=>{
        if(err_2){throw err_2};
      })
      res.redirect('/');
    }
    else{
      res.redirect('profile?msg=badPass');
    }
  });
})

module.exports = router;


