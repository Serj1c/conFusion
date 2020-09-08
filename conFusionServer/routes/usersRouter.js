var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Create a new user
router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username} )
    .then(user => {
      if(user != null) {
        let err = new Error('User ' + req.body.username + ' already exists');
        err.status(404); // 403 - means Forbidden
        next(err);
      } else {
          return User.create({
            username: req.body.username,
            password: req.body.password
          });
      }
    })
    .then(user => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({status: 'Registation - Success', user: user}, err => next(err));
    })
    .catch(err => next(err))
});

// User login
router.post('/login', (req, res, next) => {
  if(!req.session.user) { 
    let authHeader = req.headers.authorization;

    if(!authHeader) {
      let err = new Error('You are not authenticated!')
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];
  
    User.findOne({ username: username })
      .then(user => {
        if(user === null) {
          let err = new Error('User ' + username + ' does not exist!')
          err.status = 403;
          return next(err);
        }
        else if(user.password !== password) {
          let err  = new Error('User password is incorrect');
        }
        else if(user.username === username && password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch(err => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!')
  }
});

// User is making logout --> get request since we do not provide any info
router.get('/logout', (req, res) => {
  if(req.session) { // check whether the session exists i.e. user logged in
    req.session.destroy(); // delete the session and all info
    res.clearCookie('session-id'); // delete cookie with an id of 'session-id'
    res.redirect('/'); // redirect to home page for example
  } else {
    let err = new Error('You are not logged in!');
    err.status = 403; // Forbidden operation
    next(err);
  }
});

module.exports = router;
