const express = require('express');
const views = express.Router();
const axios = require('axios');

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

    axios.get(
        '/api/annonce',
        {
            data:{
                _id: req.params.id
            },
            headers: {
                'x-api-key': process.env.API_KEY
            },
            proxy: {
                port: 2727
            }
        })
        .then( result =>{
            console.log(result.data)
        })
        .catch( err => console.log(err));

    res.status(200);
    res.render('single-annonce', {title: 'Liste des annonces'});
});

module.exports = views;