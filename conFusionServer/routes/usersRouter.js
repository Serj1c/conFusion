var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Create a new user
router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username} ), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    } else {
      passport.authenticate('local')(req, res, () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, status: 'Registation - Success' });
      })
    }
});
});          

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ success: true, status: 'You are successfully logged in' });
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
