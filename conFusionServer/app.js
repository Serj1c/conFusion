const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

const Dishes = require('./models/dishes');

const url = 'mongodb+srv://serj1c:spartak1@cluster0.q6r0g.mongodb.net/<dbname>?retryWrites=true&w=majority';
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

connect.then(db => {
  console.log("Connected!")
}, err => {
  console.log(err);
});

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser('juicy-pussy'));

app.use(session({
  name: 'session_id',
  secret: 'juicy_pussy',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// Auth using Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
  if(!req.user) {
      let err = new Error('You are not authenticated!')
      err.status = 401;
      return next(err);
  }
  else {
    next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
