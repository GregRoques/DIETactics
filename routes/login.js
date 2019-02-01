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
    let msg;
    if(req.query.msg == 'noUser'){
        msg = 'This email is not registered in our system. Please try again.'
    }else if(req.query.msg == 'badPass'){
        msg = 'The password you have typed is incorrect. Please try again (and be wary of capitalization).'
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
                console.log(results[0].id)
                req.session.name = results[0].name;
                req.session.email = results[0].email;
                req.session.uid = results[0].id;
                req.session.loggedIn = true;
                res.redirect('/?msg=loginSuccess');
            }
        }
    })
});


module.exports = router;