// WEBSITE CONTROLLER PAGE.

let async = require('async');
let mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

// Display sign up page on GET.
exports.sign_up_get = function(req, res, next) {
    res.render('sign_up');
}