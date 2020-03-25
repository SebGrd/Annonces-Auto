require('dotenv').config();

const clc = require('cli-color');
const logOk = clc.green.bold;

const createError = require('http-errors');
const express = require('express');
const app = express();
const parser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');

const database = require('./utils/db');

const car = require('./routes/car');
const annonce = require('./routes/annonces');
const user = require('./routes/users');
const views = require('./routes/views');

app.use(logger('dev'));
app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb', extended:true}));
app.use(express.static( 'public'));
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/img/favicon.png'));

//ROUTES
app.use('/api/car', car);
app.use('/api/annonce', annonce);
app.use('/api/user', user);
app.use('/', views);

database.connect();


app.listen(process.env.SERVER_PORT, () => {
    console.log(logOk('Server running on port :' + process.env.SERVER_PORT))
});



