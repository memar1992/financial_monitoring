var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// API routes
var authRoutes = require('./routes/authRoutes');
var userApiRoutes = require('./routes/userRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userApiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // For API routes, respond with JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({ message: err.message });
  }

  // Otherwise, render error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
