const express = require('express');
const views = express.Router();

//Home
views.get('/', (req, res, next) => {
    res.status(200);
    res.render('index', {title: 'Accueil'});
});

//Liste annonces
views.get('/liste-annonces', (req, res, next) => {
    res.status(200);
    res.render('liste-annonces', {title: 'Liste des annonces'});
});

//Single annonce
views.get('/liste-annonces/:id', (req, res, next) => {
    res.status(200);
    res.render('single-annonce', {title: 'Liste des annonces'});
});

module.exports = views;