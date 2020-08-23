const express = require('express');
const promoRouter = express.Router();

promoRouter.route('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('The data will be sent');
})
.post((req, res) => {
    res.end("The promotion " + req.body.name + " will be added with details " + req.body.description)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT is not allowed on /promotions");
})
.delete((req, res) => {
    res.end("All promotions deleted!")
});

promoRouter.route('/:promoID', (req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
})
.get((req, res) =>{
    res.end("The data about the promotion: " + req.params.promoID + " will be sent");
})
.post((req, res) =>{
    res.end("POST is not allowed on /promotions/:promoID")
})
.put((req, res) => {
    res.write("Updating the promotion: " + req.params.promoID + "\n");
    res.end("The promotion " + req.body.name + " will be updated with details: " + req.body.description);
})
.delete((req, res) => {
    res.end("Deleting the promotion: " + req.params.promoID);
});

module.exports = promoRouter;