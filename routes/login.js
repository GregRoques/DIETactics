// require express
var express = require('express');
var router = express.Router();

// middleware
const expressSession = require('express-session');
const config = require('../config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
connection.connect();
const bcrypt = require('bcrypt-nodejs');

// establish Session
const sessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  };
router.use(expressSession(sessionOptions));

// Get Login
router.get('/', (req, res, next)=>{
    let msg;
    if(req.query.msg == 'noUser'){
        msg = 'This email is not registered.'
    }else if(req.query.msg == 'badPass'){
        msg = 'Incorrect Password.'
    }
	res.render('login',{msg});
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
                console.log('======================================')
                console.log(req.session)
                req.session.uid = results[0].id;
                req.session.firstName = results[0].firstName;
                req.session.sex = results[0].sex;
                req.session.height = results[0].height;
                req.session.startingWeight = results[0].startingWeight;
                req.session.age = results[0].age;
                req.session.email= results[0].email
                req.session.targetWeight = results[0].targetWeight
                req.session.loggedIn = true;

                res.redirect('/users');

            }
        }
    })
});


module.exports = router;