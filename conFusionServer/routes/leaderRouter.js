const express = require('express');
const leaderRouter = express.Router();

leaderRouter.route('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
})
.get((req, res) => {
    res.end('The data will be sent');
})
.post((req, res) => {
    res.end('The leader' + req.body.name + ' will be added');
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT is not allowed on /leaders')
})
.delete((req, res) => {
    res.end('All leaders deleted!')
})

module.exports = leaderRouter;