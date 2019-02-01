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
        msg = 'This email address is already registered.';
    }
    res.render('register',{msg});
});

let userId;
// Return Registration
router.post('/registerProcess',(req, res, next)=>{
    const hashedPass = bcrypt.hashSync(req.body.password);
    // console.log(hashedPass);
    const checkUserQuery = `SELECT * FROM loginInfo WHERE email = ?;`;
    connection.query(checkUserQuery,[req.body.email],(error,results)=>{
        if(error){throw error;}
        if(results.length != 0){
            res.redirect('/register?msg=register');
        }else{
            const insertUserQuery = `INSERT INTO loginInfo (userName, email, hash)
            VALUES
            (?,?,?);`;
            connection.query(insertUserQuery,[req.body.userName, req.body.email, hashedPass],(error2, results2)=>{
                if(error2){throw error2};
            });
            const userIdQuery = `SELECT * FROM loginInfo WHERE email = ?;`;
                connection.query(userIdQuery,[req.body.email],(error3,results3)=>{
                    // console.log(results3[0]);
                    userId = results3[0].id;
            });
            res.redirect('/register/profileCreation');
        };
    });
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

    const insertUserQuery = `INSERT INTO userProfileInfo (firstName, sex, height, startingWeight, age, targetWeight, userId)
        VALUES
        (?,?,?,?,?,?,?);`;
        connection.query(insertUserQuery,[firstName, sex, heightTotalCm, startingWeightKg, age, targetWeightKg, userId],(error, results)=>{
            if(error){throw error};
    });
  });

module.exports = router;