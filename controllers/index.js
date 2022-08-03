// WEBSITE CONTROLLER PAGE.

let mongoose = require('mongoose');
let bcryptjs = require('bcryptjs');
var passport = require('passport');

const { body, validationResult } = require('express-validator');

let User = require("../models/user");
let Message = require("../models/message");


// GET request for home page.
exports.home_page_get = function(req, res, next) {
    console.log(req.user);
    res.render('index', { user : req.user });
}

// ------------------------------------------------------------------------------------------------- AUTHENTICATION FUNCTIONS.

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

        // Re-render sign_up view if errors are present.
        if (!errors.isEmpty()) {
            res.render('sign_up', {
                persistant_username : req.body.username,
                persistant_password : req.body.password,
                errors : errors.array()
            });
            return;
        }

        // If validation critera are met, encrypt password and send data to database!
        else {
            bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }

                else {
                    let user = new User({
                        username : req.body.username,
                        password : hashedPassword
                    }).save( err => {
                        if (err) {
                            return next(err);
                        }

                        res.redirect('/');
                    });
                }
            }
        )}
    }
]

// GET request for user login.
exports.user_login_get = function(req, res, next) {
    res.render('login');
}

// POST request for user login.
exports.user_login_post = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/incorrect-credentials'
});

// GET request for failed user login.
exports.failed_login_get = function(req, res, next) {
    res.render('wrong_credentials');
}

// GET request for user log out. 
exports.user_logout_get = function(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    })
}

// -------------------------------------------------------------------------------------------------------- MESSAGE FUNCTIONS.

// GET request for creating new message.
exports.create_message_get = function(req, res, next) {
    res.render('create_message');
}

exports.create_message_post = [
    body('message_title', 'A message title is required!')
    .trim()
    .isLength({ min : 1, max : 20 })
    .withMessage("Title must be between 3 and 20 characters long."),

    body('message-content', 'Message content is required!')
    .trim()
    .isLength({ min : 3 })
    .withMessage("Your message must be at least 3 characters long.")
    .escape(),

    // Process request once data validation completed.
    (req, res, next) => {
        console.log("we are here, don't worry!");
        console.log(req.body);
        console.log(req.body.message_title);
        
        const errors = validationResult(req);

        // Re-render sign_up view if errors are present.
        if (!errors.isEmpty()) {
            res.render('create_message', {
                persistant_title : 'test',
                persistant_message : 'hmmmmmm',
                errors : errors.array()
            });
            return;
        }
    }
]