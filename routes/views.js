const express = require('express');
const views = express.Router();
const axios = require('axios');
const database = require('./../utils/db');
axios.defaults.proxy = {port: process.env.SERVER_PORT};


//Home
views.get('/', (req, res) => {
    res.status(200);
    res.render('index', {title: 'Accueil'});
});


//Connexion
views.get('/connexion', (req, res) => {
    res.status(200);
    res.render('connexion', {title: 'Connexion'})
});


//Liste annonces
views.get('/liste-annonces', async (req, res) => {

    await database.carModel.distinct('brand')
        .then(brands => {

            if (Object.keys(req.query).length !== 0){  // Si query params (/liste-annonces?...)
                if (!req.query.model){
                    req.query.model = 'null';
                }
                let searchObject = {
                    'car.brand' : req.query.brand === 'null' ? {$ne: 'null'} : req.query.brand,
                    'car.model' : req.query.model === 'null' ? {$ne: 'null'} : req.query.model,
                    'car.details.energy' : req.query.energy === 'null' ? {$ne: 'null'} : req.query.energy,
                    'car.details.transmission' : req.query.transmission === 'null' ? {$ne: 'null'} : req.query.transmission,
                    'car.details.hp' : req.query.ch === 0 ? {$ne: -1} : {$gt: req.query.ch},
                    'car.details.km' : req.query.km === '0' ? {$gt: '0'} : {$lt: req.query.km},
                };
                database.annonceModel.find(searchObject, (err, docs) => {
                    if (err){
                        console.log(err);
                        res.status(500);
                        res.json({"message" : err.message});
                    }
                    if (docs.length > 0){
                        let annonces = docs;
                        res.status(200);
                        res.render('liste-annonces', {
                            title: 'Liste des annonces',
                            annonces: annonces,
                            brands: brands
                        });
                    } else {
                        res.status(404);
                        res.render('liste-annonces', {
                            title: 'Liste des annonces',
                            error: 'Aucune annonce correspondant à votre recherche.',
                            brands: brands
                        });
                    }

                });
            } else { // Si base url (/liste-annonces)
                axios.get('/api/annonce')
                    .then( result => {
                        let annonces = result.data;
                        res.status(200);
                        res.render('liste-annonces', {
                            title: 'Liste des annonces',
                            annonces: annonces,
                            brands: brands
                        });
                    })
                    .catch( err => {
                        if (err.response.status === 404) {
                            res.status(404);
                            res.render('liste-annonces', {
                                title: 'Liste des annonces',
                                error: 'Aucune annonce',
                                brands: brands
                            });
                        } else {
                            res.status(404);
                            res.render('404', {title: '404'});
                        }
                    });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500);
            res.json({"message" : err.message});
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