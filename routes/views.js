const express = require('express');
const views = express.Router();
const axios = require('axios');
axios.defaults.proxy = {port: process.env.SERVER_PORT};


//Home
views.get('/', (req, res, next) => {
    res.status(200);
    res.render('index', {title: 'Accueil'});
});

//Liste annonces
views.get('/liste-annonces', (req, res, next) => {
    axios.get('/api/annonce')
        .then( result => {
            annonces = result.data;
            res.status(200);
            res.render('liste-annonces', {title: 'Liste des annonces', annonces: annonces});
        })
        .catch( err => {
            res.status(404);
            res.render('404', {title: '404'});
        });
});

//Single annonce
views.get('/liste-annonces/:id', (req, res, next) => {

    axios.get('/api/annonce/?id='+req.params.id,)
        .then( result =>{
            carData = result.data;
            res.status(200);
            res.render('single-annonce', {title: carData.car.brand+' '+carData.car.model, car: carData.car});
        })
        .catch( err => {
            res.status(404);
            res.render('404', {title: '404'});
        });

});

module.exports = views;