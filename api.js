require('dotenv').config();

const clc = require('cli-color');
const logOk = clc.green.bold;

const createError = require('http-errors');
const express = require('express');
const app = express();
const parser = require('body-parser');
const logger = require('morgan');

const database = require('./middlewares/mongoose');

const car = require('./routes/car');
const annonce = require('./routes/annonces');

app.use(logger('dev'));
app.use(express.static(__dirname + 'public'));
app.use(parser.json());

app.get('/', (req, res, next) => {
    res.status(200);
    res.json({"message": "Annonces-auto API"})
});

app.use('/car', car);
app.use('/annonce', annonce);

database.connect();

app.listen(2727, () => {
    console.log(logOk('Server running on 2727'))
});



