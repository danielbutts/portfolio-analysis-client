const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './', 'node_modules')));

app.use(cookieSession({
  name: 'partridge',
  secret: process.env.SESSION_SECRET,
  secure: app.get('env') === 'production',
}));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon-32x32.png')));

app.use('/api/login', require('./routes/login'))

app.use('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => { // eslint-disable-line no-unused-vars
  if (err.status === 401) {
    res.redirect('/auth/login');
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
