// require express
var express = require('express');
var router = express.Router();

// middleware
const config = require('../config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
connection.connect();
const bcrypt = require('bcrypt-nodejs');


// Get Registration
router.get('/',(req, res)=>{
    let msg;
    if(req.query.msg == 'register'){
        msg = 'This email address is already registered. Please try again!';
    }else if(req.query.msg == 'password'){
        msg = 'The password you entered is not long enough. Please enter a password this is 8 characters long or more.'
    }
    res.render('register',{msg});
});

// Global Variables
let hashPass;
let email;
const passwordRegex = new RegExp("^.{8,}$");

// Return Registration
router.post('/registerProcess',(req, res, next)=>{
    const checkUserQuery = `SELECT * FROM userProfileInfo WHERE email = ?;`;
    connection.query(checkUserQuery,[req.body.email],(error,results)=>{
        if(error){throw error;}
        if(results.length != 0){
            res.redirect('/register?msg=register');
        }else if(!passwordRegex.test(req.body.password)){
            res.redirect('/register?msg=password');
        }else{
            email = req.body.email;
            hashPass = bcrypt.hashSync(req.body.password);
            res.redirect('/register/profileCreation');
        };
    });
});


router.get("/profileCreation", (req,res,next)=>{
    let msg;
    res.render("profileCreation", {msg});
  })
  
router.post("/userProfileCreation", (req,res,next)=>{
    const firstName = req.body.firstName;
    const age = req.body.age;
    const sex = req.body.sex;
    console.log(req.body.hello);
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

    const insertUserQuery = `INSERT INTO userProfileInfo (firstName, sex, height, startingWeight, age, targetWeight, email, hash)
        VALUES
        (?,?,?,?,?,?,?,?);`;
    connection.query(insertUserQuery,[firstName, sex, heightTotalCm, startingWeightKg, age, targetWeightKg, email, hashPass],(error, results)=>{
        if(error){throw error};
    });
    res.redirect('/login?msg=register');
  });

module.exports = router;