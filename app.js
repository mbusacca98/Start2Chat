var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mysql = require("mysql");
const config = require("./config.json");
var socket = require("./socket/socket");

var favicon = require('serve-favicon')

var indexRouter = require('./routes/router');

var app = express();
app.io = require("socket.io")();
socket(app.io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//favicon ico
app.use(favicon(path.join(__dirname, 'public', 'images','logo.png')))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "chat-campus-node",
}));
app.use(express.static(path.join(__dirname, 'public')));

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
  res.render('error', {error: err.status || 500});
});

//Start My Code

module.exports = app;
