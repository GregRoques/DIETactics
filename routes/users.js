var express = require('express');
var router = express.Router();
const config = require('../config');
const request = require("request");
const bcrypt = require("bcrypt-nodejs");

const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
connection.connect();

let totalCalories = 0;
const currDate = new Date()
let currMon= currDate.getMonth()+1
let currDay= currDate.getDate()
let currYear = currDate.getFullYear()
let publishDate = `${currYear}-${currMon}-${currDay}`
const inputDateMax = `${currYear}-${currMon}-${currDay}`

const apiBaseUrl = "https://trackapi.nutritionix.com/";

router.post("/dailyProgress", (req,res,next)=>{
  const date = req.body.date;
  const breakfast = req.body.breakfast;
  const lunch = req.body.lunch;
  const dinner = req.body.dinner;
  const other = req.body.other;
  const id = req.session.uid;
  const dailyWeight = req.body.dailyWeight;

  publishDate = date.replace(/-0+/g, '-');


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
  request.post({url: searchUrl, headers: headers, body: JSON.stringify(options)},(error,response,body)=>{
    const parsedData = JSON.parse(body);
    const foodArray = parsedData.foods;
    // let totalCalories = 0;
    for(let i = 0; i < foodArray.length; i++){
      totalCalories += foodArray[i].nf_calories;
      // console.log(foodArray[i].food_name, foodArray[i].nf_calories)
      
    }
    const selectUserQuery = `
    SELECT * from userProgress WHERE date = '${date}' AND userId = '${id}';`
        
        connection.query(selectUserQuery,(error, results)=>{
            if(error){throw error};
            if(results.length > 0){
              const updateUserQuery =`UPDATE userProgress SET dailyWeight = ?, calories = ? WHERE date = '${date}' AND userId = '${id}'`;
              connection.query(updateUserQuery,[dailyWeight,totalCalories],(error, results)=>{
                if(error){throw error};
              });
            } else {
              const insertUserQuery = `INSERT INTO userProgress (dailyWeight,date,calories,userId)
              VALUES
              (?,?,?,?);`;
              connection.query(insertUserQuery,[dailyWeight,date,totalCalories,id],(error, results)=>{
                  if(error){throw error};
              });
            }
    });
    res.redirect('/users')
  });

})

/* GET users listing. */
router.get('/', function(req, res, next) {

  const sex = req.session.sex;
  const age = req.session.age;
  const startWeight = req.session.startingWeight;
  const weight = req.session.targetWeight;
  const height = req.session.height;
 
  // Calculate Cal-per-day-per-user using the Harris–Benedict_equation. Read More here: https://bit.ly/1I9tmyJ;
  let userCal
  let calGoal
  let gainLose
  let dailyCal = (Math.round(totalCalories)).toString();
  if (sex == 'male'){
    userCal = (Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5)).toString();
    if(startWeight>weight){
      gainLose = "lose"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))-500)).toString();
    }else{
      gainLose = "gain"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))+500)).toString();
    }
  }else{
    userCal = (Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161)).toString();
    if(startWeight>=weight){
      gainLose = "lose"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))-500)).toString();
    }else{
      gainLose = "gain"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))+500)).toString();
    }
    res.render("dailyInput", {inputDateMax, publishDate, userCal, calGoal, gainLose, dailyCal})
  console.log(inputDateMax)
  }
});

router.get("/weeklyProgress", (req,res,next)=>{
  const sex = req.session.sex;
  const age = req.session.age;
  const startWeight = req.session.startingWeight;
  const weight = req.session.targetWeight;
  const height = req.session.height;

  const currDate = new Date()
  let currMon= currDate.getMonth()+1
  let currDay= currDate.getDate()
  let currYear = currDate.getFullYear()
  let publishDate = `${currMon}-${currDay}-${currYear}`
 
  // Calculate Cal-per-day-per-user using the Harris–Benedict_equation. Read More here: https://bit.ly/1I9tmyJ;
  let userCal
  let calGoal
  let gainLose
  let dailyCal = (Math.round(totalCalories)).toString();
  if (sex == 'male'){
    userCal = (Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5)).toString();
    if(startWeight>weight){
      gainLose = "lose"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))-500)).toString();
    }else{
      gainLose = "gain"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))+500)).toString();
    }
  }else{
    userCal = (Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161)).toString();
    if(startWeight>weight){
      gainLose = "lose"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))-500)).toString();
    }else{
      gainLose = "gain"
      calGoal = (((Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5))+500)).toString();
    }
  }

  let userDates = [];
  let userWeightProgress = [];
  let userCalories = [];
  const userProgressQuery = `SELECT * FROM userProgress WHERE userId = ?
  ORDER BY date DESC
  LIMIT 7;`
  console.log(req.session);
  connection.query(userProgressQuery,[req.session.uid],(error, results)=>{
    if(error){throw error};
    let userInformationArray = results;
    for(let i = 0; i < userInformationArray.length; i++){
      userDates.push(userInformationArray[i].date);
      userWeightProgress.push(userInformationArray[i].dailyWeight)
      userCalories.push(userInformationArray[i].calories);
    }
    let data = {
      userDates : userDates,
      userWeightProgress: userWeightProgress,
      userCalories: userCalories
    };

    res.render("weeklyProgress", {data, publishDate, userCal, calGoal, gainLose, dailyCal});
  });
});

/* router.get("/weeklyProgress",(req,res,next)=>{
  let userDates = [];
  let userWeightProgress = [];
  let userCalories = [];
  const userProgressQuery = `SELECT * FROM userProgress WHERE userId = ?
  ORDER BY date DESC
  LIMIT 7;`
  console.log(req.session);
  connection.query(userProgressQuery,[req.session.uid],(error, results)=>{
    if(error){throw error};
    let userInformationArray = results;
    for(let i = 0; i < userInformationArray.length; i++){
      userDates.push(userInformationArray[i].date);
      userWeightProgress.push(userInformationArray[i].dailyWeight)
      userCalories.push(userInformationArray[i].calories);
    }
    let averageCalories = Math.round((userCalories.reduce((a,b)=>a+b,0))/(userCalories.length));
    let data = {
      userDates : userDates,
      userWeightProgress: userWeightProgress,
      userCalories: userCalories
    };

    res.render("weeklyProgress", {data, averageCalories, publishDate, userCal, calGoal, gainLose, dailyCal});
  })
}); */

router.get("/profile",(req,res,next)=>{
  const userId = req.session.uid;
  const selectUserProfileQuery = `SELECT * FROM userProfileInfo
  WHERE id = ?`;

  connection.query(selectUserProfileQuery,[userId],(err,results)=>{
    if(err){throw err};

    let heightTotalInches = Math.round(results[0].height / 2.54);
    let heightFeet;
    let heightInches = 0;
    if(heightTotalInches % 12 > 0){
      while(heightTotalInches % 12 > 0){
        heightInches += 1;
        heightTotalInches= heightTotalInches - 1;
        heightFeet = heightTotalInches;
      }
    }
    heightFeet = heightFeet/12;

    let msg;
    res.render('profile',{
      data : {
        firstName: results[0].firstName,
        age: results[0].age,
        sex: results[0].sex,
        heightFeet: heightFeet,
        heightInches: heightInches,
        startingWeight: Math.round(results[0].startingWeight / 0.453592),
        targetWeight: Math.round(results[0].targetWeight / 0.45359),
      },
      msg
    });
  });
});

router.post('/profile/profileEdit',(req,res,next)=>{
  // Name, Age, Sex, Id
  const editFirstName = req.body.firstName;
  const editAge = req.body.age;
  const editSex = req.body.sex;
  const userId = req.session.uid;

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
      res.redirect('/users');
    }
    else{
      res.redirect('profile?msg=badPass');
    }
  });
})

module.exports = router;