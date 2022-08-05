// WEBSITE CONTROLLER PAGE.

let mongoose = require('mongoose');
let bcryptjs = require('bcryptjs');
var passport = require('passport');

const { body, validationResult } = require('express-validator');

let User = require("../models/user");
let Message = require("../models/message");


// GET request for home page.
exports.home_page_get = function(req, res, next) {

    Message.find()
    .populate('author')
    .exec(function (err, output) {
        if (err) {
            return next(err);
        }

        console.log(output);

        res.render('index', {
             user : req.user,
             message_list : output
            });

    })
}

// POST request for home page. Delete message functionality.
exports.home_page_post = function(req, res, next) {

    Message.findByIdAndDelete(req.body.message_id, function(err, output) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log("Message deleted.");
            res.redirect("/");
        }
    })
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

    body('confirm-password', 'Confirm password must have the same value as the password field.')
    .trim()
    .custom((value, { req }) => value === req.body.password),

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
                        password : hashedPassword,
                        isMember : false,
                        isAdmin : true
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

// POST request for creating new message.
exports.create_message_post = [
    body('message_title', 'A message title is required!')
    .trim()
    .isLength({ min : 1, max : 20 })
    .withMessage("Title must be between 3 and 20 characters long."),

    body('message_content', 'Message content is required!')
    .trim()
    .isLength({ min : 3 })
    .withMessage("Your message must be at least 3 characters long.")
    .escape(),

    // Process request once data validation completed.
    (req, res, next) => {
        const errors = validationResult(req);

        // Re-render sign_up view if errors are present.
        if (!errors.isEmpty()) {
            res.render('create_message', {
                persistant_title : req.body.message_title,
                persistant_message : req.body.message_content,
                errors : errors.array()
            });
            return;
        }

        // If validation critera are met, create new message and send to the database.
        else {
            let message = new Message({
                author: req.user._id,
                title: req.body.message_title,
                message: req.body.message_content,
                timestamp: Date.now()
            }).save( err => {
                if (err) {
                    return next(err);
                }

                res.redirect('/');
            })
        }
    }
]

// -------------------------------------------------------------------------------------------------- MEMBER ACCESS FUNCTIONS.

// GET request for member access page.
exports.get_member_access = function(req, res, next) {
    res.render('member_access');
}

// POST request for gaining member access.
exports.post_member_access = [
    body('members-pass', 'Incorrect password, access denied!')
    .custom((value, { req }) => value === process.env.MEMBER_ACCESS_PASS),

    (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.user._id);
        // If errors.
        if (!errors.isEmpty()) {
            res.redirect("/");
        } 
        
        else {
            User.findByIdAndUpdate(req.user._id,
                {
                    'isMember' : true
                },

                function(err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                })
            
        }
    }
]