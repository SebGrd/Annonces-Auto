const express = require('express');
const views = express.Router();
const axios = require('axios');
const database = require('./../utils/db');
axios.defaults.proxy = {port: process.env.SERVER_PORT};


//Home
views.get('/', (req, res, next) => {
    res.status(200);
    res.render('index', {title: 'Accueil'});
});

//Liste annonces
views.get('/liste-annonces', (req, res) => {
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
views.get('/liste-annonces/annonce/', (req, res) => {
    res.status(404);
    res.render('404', {title: '404'});
});
views.get('/liste-annonces/annonce/:id', (req, res) => {

    axios.get('/api/annonce/?id='+req.params.id,)
        .then( result =>{
            carData = result.data;
            res.status(200);
            res.render('single-annonce', {title: carData.car.brand+' '+carData.car.model, annonce: carData});
        })
        .catch( err => {
            res.status(404);
            res.render('404', {title: '404'});
        });

});


//Ajouter annonce
views.get('/ajouter-une-annonce', async (req, res) => {

    await database.carModel.distinct('brand')
        .then(brands => {
            res.status(200);
            res.render('addAnnonce', {title: 'Ajouter une annonce', brands: brands});
        })
        .catch(err => {
            res.status(500);
            res.json({"message" : err.message});
        });


});

module.exports = views;