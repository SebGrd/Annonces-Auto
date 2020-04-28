require('dotenv').config();

const clc = require('cli-color');
const logOk = clc.green.bold;

const createError = require('http-errors');
const express = require('express');
const app = express();
const parser = require('body-parser');
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon');
const logger = require('morgan');

const database = require('./utils/db');

const car = require('./routes/car');
const annonce = require('./routes/annonces');
const user = require('./routes/users');
const views = require('./routes/views');

app.use(logger('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET))
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

//404
app.use( (req, res) => {
    if (req.logged === true){
        res.status(404).render('404', {
            title: '404',
            logged: true,
            userData: req.userData
        });
    } else {
        res.status(404).render('404', {title: '404'});
    }
});

database.connect();


app.listen(process.env.SERVER_PORT, () => {
    console.log(logOk('Server running on port :' + process.env.SERVER_PORT))
});



