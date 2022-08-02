// WEBSITE CONTROLLER PAGE.

let async = require('async');
let mongoose = require('mongoose');
let bcryptjs = require('bcryptjs');
var passport = require('passport');

const { body, validationResult } = require('express-validator');

let User = require("../models/user");


// GET request for account sign up.
exports.sign_up_get = function(req, res, next) {
    res.render('sign_up');
}

// POST request for account sign up form.
exports.sign_up_post = [

    body('username', 'A username is required.')
    .trim()
    .isLength({ min : 3, max : 20 })
    .withMessage("Username must be between 3 and 20 characters long."),

    body('password', 'A password is required.')
    .trim()
    .isLength({ min : 8 })
    .withMessage("Password must be 8 characters or greater in length.")
    .escape(),

    // Process request once data validation completed.
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        console.log(req.body.username);

        // Re-render sign_up view if errors are present.
        if (!errors.isEmpty()) {
            res.render('sign_up', {
                persistant_username : req.body.username,
                persistant_password : req.body.password,
                errors : errors.array()
            });
            return;
        }

        else {
            let user = new User({
                username : req.body.username,
                password : req.body.password
            });
            
            user.save(err => {
                if (err) {
                    return next(err);
                }

                res.redirect("/");
            });
        }

        // // If validation critera are met, encrypt password and send data to database!
        // bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        //     if (err) {
        //         return next(err);
        //     }

        //     else {
        //         let user = new User({
        //             user_name : req.body.username,
        //             password : hashedPassword
        //         }).save(err => {
        //             if (err) {
        //                 return next(err);
        //             }

        //             res.redirect("/");
        //         });
        //     }
        // });
    }
]

// GET request for user login.
exports.user_login_get = function(req, res, next) {
    res.render('login');
}

// POST request for user login.
exports.user_login_post = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
});

// GET request for user log out. Don't need POST request!
exports.user_logout_get = function(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    })
}