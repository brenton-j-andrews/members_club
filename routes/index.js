// WEBSITE ROUTING PAGE.

const { Router } = require('express');
var express = require('express');
var router = express.Router();

// Controller module import.
let controller = require("../controllers/index");

// GET home page.
router.get('/', controller.home_page_get);

// ------------------------------------------------------------------------------------------------- AUTHENTICATION ROUTES.

// GET request for user login page.
router.get('/login', controller.user_login_get);

// POST request for user login page.
router.post('/login', controller.user_login_post);

// GET request for failed user login.
router.get('/incorrect-credentials', controller.failed_login_get); 

// GET request for user sign up page.
router.get('/sign-up', controller.sign_up_get);

// POST request for user sign up page.
router.post('/sign-up', controller.sign_up_post);

// GET request for user log out.
router.get('/log-out', controller.user_logout_get);

// -------------------------------------------------------------------------------------------------------- MESSAGE ROUTES.

// GET request for creating message.
router.get('/create-message', controller.create_message_get);

// POST request for creating message.
router.post('/create-message', controller.create_message_post);

// -------------------------------------------------------------------------------------------------- MEMBER ACCESS ROUTES.

// GET request for member access page.
router.get('/member-access', controller.get_member_access);

// POST request for gaining member access.
router.post('/member-access', controller.post_member_access);


module.exports = router;
