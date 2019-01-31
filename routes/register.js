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
        msg = 'This email adress is already registered.';
    }
    res.render('register',{msg});
});

// Return Registration
router.post('/registerProcess',(req, res, next)=>{
    const hashedPass = bcrypt.hashSync(req.body.password);
    console.log(hashedPass);
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
                res.redirect('/?msg=regSuccess');
            });
        };
    });
});

module.exports = router;