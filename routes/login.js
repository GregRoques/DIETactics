// require express
var express = require('express');
var router = express.Router();

// middleware

const config = require('../config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
connection.connect();
const bcrypt = require('bcrypt-nodejs');

// Get Login
router.get('/', (req, res, next)=>{
    let title, msg;
    if(req.query.msg == 'noUser'){
        title = 'Error';
        msg = 'This email is not registered in our system. Please try again.'
    }else if(req.query.msg == 'badPass'){
        title = 'Error';
        msg = 'The password you have typed is incorrect. Please try again (and be wary of capitalization).';
    }else if(req.query.msg == 'register'){
        title = 'Registration Success';
        msg = 'You have been successfully registered. You can now log-in below.';
    }else if(req.query.msg == 'loggedOut'){
        title = 'Logged Out';
        msg = 'You have been successfully logged out. Have a nice day!';
    }
	res.render('login',{title, msg});
});

// Return Login
router.post('/loginProcess',(req, res, next)=>{
    const email =  req.body.email;
    const password = req.body.password;

    const checkPasswordQuery = `SELECT * FROM userProfileInfo WHERE email = ?`;
    connection.query(checkPasswordQuery,[email],(error, results)=>{
         
        if(error){throw error;}
        if(results.length == 0 ){
            res.redirect('/login?msg=noUser');
        }else{
            const passwordsMatch = bcrypt.compareSync(password,results[0].hash);
            if(!passwordsMatch){
                res.redirect('/login?msg=badPass');
            }else{

                
                // console.log(results[0].id)

                req.session.uid = results[0].id;
                req.session.firstName = results[0].firstName;
                req.session.sex = results[0].sex;
                req.session.height = results[0].height;
                req.session.startingWeight = results[0].startingWeight;
                req.session.age = results[0].age;
                req.session.email= results[0].email
                req.session.targetWeight = results[0].targetWeight
                req.session.loggedIn = true;

                // console.log(req.session)

                const selectQuery = `SELECT * FROM userProgress WHERE userId = ?
                ORDER BY date DESC
                LIMIT 7;`
                connection.query(selectQuery,[req.session.uid],(error2,results2)=>{
                    const currDate = new Date();
                    let currMon= currDate.getMonth()+1;
                    let currDay= currDate.getDate();
                    let currYear = currDate.getFullYear();
                    let publishDate = `${currYear}-${currMon}-${currDay}`;
                    // console.log(results2);
                    let datesFromDb = [];

                    for(let i = 0; i < results2.length; i++){
                        let resultDate = results2[i].date
                        let resultMon= resultDate.getMonth()+1;
                        let resultDay= resultDate.getDate();
                        let resultYear = resultDate.getFullYear();
                        let formattedDateFromDb = `${resultYear}-${resultMon}-${resultDay}`;
                        datesFromDb.push(formattedDateFromDb);
                    }
                    console.log(datesFromDb);
                        if(datesFromDb[0] == publishDate){
                        res.redirect("/users/weeklyProgress");
                        } else {
                        res.redirect('/users');
                    }
                });
            }
        }
    })
});


router.get("/logout", (req,res,next)=>{
    req.session.destroy();
    res.redirect('/login?msg=loggedOut')
});

module.exports = router;