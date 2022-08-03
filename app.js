
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var express = require('express');
var dotenv = require('dotenv').config();
let mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
let session = require("express-session");
var indexRouter = require('./routes/index');
let bcryptjs = require('bcryptjs');


// SET UP MONGOOSE CONNECTION.
var mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// IMPORT MODELS.
let User = require("./models/user");


// VIEW ENGINE SET UP.
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT / SESSION CONFIG.
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcryptjs.compare(password, user.password, (err, res) => {

        if (res) {
          return done(null, user);
        } 

        else {
          console.log("wrong password dumbass!");
          return done(null, false, { message : "Incorrect Password"});
        }

      })

    });
  })
);

app.use(session({ secret: "hmmm", resave: false, saveUninitialized: true }))
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended : false }));


// SITE ROUTING.
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
