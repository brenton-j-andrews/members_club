// WEBSITE ROUTING PAGE.

var express = require('express');
var router = express.Router();

// Controller module import.
let controller = require("../controllers/index");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET request for user sign up page.
router.get('/sign-up', controller.sign_up_get);

// POST request for user sign up page.
router.post('sign-up', function(req, res, next) {

})

module.exports = router;
