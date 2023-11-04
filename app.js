var express = require('express');
var logger = require('morgan');
var rateLimit = require('./rateLimit');
var app = express();
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 60, // limit each IP to 100 requests per windowMs
    statusCode: 500, // status to send when rate limit is exceeded
    message: "Too many requests, please try again later.",
    headers: true, // send rate limit headers with the response
});
app.use(limiter);


// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/test1', (req, res) => {
        res.send('Test1');
});
app.get('/test2', (req, res) => {
        res.send('Test2');
});


module.exports = app;
