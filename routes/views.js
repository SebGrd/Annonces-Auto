const express = require('express');
const cookieParser = require('cookie-parser');
const views = express.Router();
const axios = require('axios');
const database = require('./../utils/db');
const utils = require('./../utils/utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
axios.defaults.proxy = {port: process.env.SERVER_PORT};


views.use(utils.authenticate);
//Home
views.get('/', (req, res) => {
    if (req.logged === true) {
        res.status(200).render('index', {
            title: 'Accueil',
            logged: true,
            userData: req.userData
        });
    } else {
        res.status(200).render('index', {title: 'Accueil'});
    }
});
//Connexion

views.get('/connexion', (req, res) => {
    if (req.logged === true) {
        res.status(200).render('index', {
            title: 'Connexion',
            logged: true,
            userData: req.userData
        });
    } else {
        res.status(200).render('connexion', {title: 'Connexion'})
    }
});

views.post('/login', async (req, res) => {
    if (req.logged === true) {
        res.status(301).redirect('/')
    } else {
        await database.userModel.findOne({mail: req.body.mail}, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({"message": err.message});
            }
            if (doc === null) return res.status(404).redirect('/connexion?err=Utilisateur%20introuvable');

            bcrypt.compare(req.body.password, doc.password)
                .then(passCorrect => {
                    if (passCorrect) {
                        const accessToken = jwt.sign({
                            _id: doc._id,
                            username: doc.username,
                            mail: doc.mail,
                            professional: doc.professional
                        }, process.env.JWT_SECRET);

                        const options = {
                            maxAge: 1000 * 60 * 60, //1heure
                            httpOnly: true,
                            signed: true
                        }
                        res.cookie('jwt', accessToken, options)

                        res.status(200).redirect('/')
                    } else {
                        res.status(401).redirect('/connexion?err=Mauvais%20identifiants');
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({"message": "Server error"});
                })

        });
    }

});

views.get('/deconnexion', (req, res) => {
    if (req.logged) {
        res.cookie('jwt', {maxAge: 0});
        res.status(301).redirect('back');
    } else {
        res.status(301).redirect('back');
    }
});

views.get('/mon-compte', utils.authenticate, async (req, res) => {
    if (req.logged === true) {

        database.userModel.findOne({_id: req.userData._id}, (err, userInfo) => {
            if (err) return res.status(500).json({"message": err.message});
            if (userInfo === null) return res.status(404).json({"message": "id introuvable"});

            database.annonceModel.find({user: req.userData._id}, (err, posts) => {
                if (err) return res.status(500).json({"message": err.message});
                if (posts === null) return res.status(404).json({"message": "doc empty/null"});

                let options = {
                    "title": "Mon compte",
                    logged: true,
                    userData: req.userData,
                    user: userInfo,
                    annonces: posts
                }
                res.status(200).render('account', options);

            });

        });


    } else {
        res.status(401).redirect('/connexion');
    }
});

views.get('/calculer-les-chevaux-fiscaux-de-mon-vehicule', (req, res) => {
    if (req.logged === true) {
        res.status(200).render('calculPuissanceFiscale', {
            title: 'Calculer les chevaux fiscaux de mon véhicule',
            logged: true,
            userData: req.userData
        });
    } else {
        res.status(200).render('calculPuissanceFiscale', {title: 'Calculer les chevaux fiscaux de mon véhicule'});
    }
});

views.get('/eligibilite-critair', (req, res) => {
    if (req.logged === true) {
        res.status(200).render('critair', {
            title: 'Connaitre son eligibilité CRIT\'air',
            logged: true,
            userData: req.userData
        });
    } else {
        res.status(200).render('critair', {title: 'Connaitre son eligibilité CRIT\'air'});
    }
});


//Liste annonces
views.get('/liste-annonces', async (req, res) => {
    if (req.logged === true) {
        await database.carModel.distinct('brand')
            .then(brands => {

                if (Object.keys(req.query).length !== 0) {  // Si query params (/liste-annonces?...)
                    if (!req.query.model) {
                        req.query.model = 'null';
                    }
                    let searchObject = {
                        'car.brand': req.query.brand === 'null' ? {$ne: 'null'} : req.query.brand,
                        'car.model': req.query.model === 'null' ? {$ne: 'null'} : req.query.model,
                        'car.details.energy': req.query.energy === 'null' ? {$ne: 'null'} : req.query.energy,
                        'car.details.transmission': req.query.transmission === 'null' ? {$ne: 'null'} : req.query.transmission,
                        'car.details.hp': req.query.ch === 0 ? {$ne: -1} : {$gt: req.query.ch},
                        'car.details.km': req.query.km === '0' ? {$gt: '0'} : {$lt: req.query.km},
                    };
                    database.annonceModel.find(searchObject, (err, docs) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.json({"message": err.message});
                        }
                        if (docs.length > 0) {
                            let annonces = docs;
                            res.status(200);
                            res.render('liste-annonces', {
                                title: 'Liste des annonces',
                                logged: true,
                                userData: req.userData,
                                annonces: annonces,
                                brands: brands
                            });
                        } else {
                            res.status(404);
                            res.render('liste-annonces', {
                                title: 'Liste des annonces',
                                logged: true,
                                userData: req.userData,
                                error: 'Aucune annonce correspondant à votre recherche.',
                                brands: brands
                            });
                        }

                    });
                } else { // Si base url (/liste-annonces)
                    axios.get('/api/annonce')
                        .then(result => {
                            let annonces = result.data;
                            res.status(200);
                            res.render('liste-annonces', {
                                title: 'Liste des annonces',
                                logged: true,
                                userData: req.userData,
                                annonces: annonces,
                                brands: brands
                            });
                        })
                        .catch(err => {
                            if (err.response.status === 404) {
                                res.status(404);
                                res.render('liste-annonces', {
                                    title: 'Liste des annonces',
                                    logged: true,
                                    userData: req.userData,
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
                res.json({"message": err.message});
            });
    } else {
        await database.carModel.distinct('brand')
            .then(brands => {

                if (Object.keys(req.query).length !== 0) {  // Si query params (/liste-annonces?...)
                    if (!req.query.model) {
                        req.query.model = 'null';
                    }
                    let searchObject = {
                        'car.brand': req.query.brand === 'null' ? {$ne: 'null'} : req.query.brand,
                        'car.model': req.query.model === 'null' ? {$ne: 'null'} : req.query.model,
                        'car.details.energy': req.query.energy === 'null' ? {$ne: 'null'} : req.query.energy,
                        'car.details.transmission': req.query.transmission === 'null' ? {$ne: 'null'} : req.query.transmission,
                        'car.details.hp': req.query.ch === 0 ? {$ne: -1} : {$gt: req.query.ch},
                        'car.details.km': req.query.km === '0' ? {$gt: '0'} : {$lt: req.query.km},
                    };
                    database.annonceModel.find(searchObject, (err, docs) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.json({"message": err.message});
                        }
                        if (docs.length > 0) {
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
                        .then(result => {
                            let annonces = result.data;
                            res.status(200);
                            res.render('liste-annonces', {
                                title: 'Liste des annonces',
                                annonces: annonces,
                                brands: brands
                            });
                        })
                        .catch(err => {
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
                res.json({"message": err.message});
            });
    }

});

views.get('/liste-annonces/annonce/:id', async (req, res) => {
    let carData = {};
    await axios.get('/api/annonce/?id=' + req.params.id,)
        .then(result => {
            carData = result.data;
            axios.get('/api/user/' + carData.user, {
                headers: {
                    'x-api-key': process.env.API_KEY,
                }
            })
                .then(user => {
                    if (req.logged === true) {
                        res.status(200);
                        res.render('single-annonce', {
                            title: carData.car.brand + ' ' + carData.car.model,
                            annonce: carData,
                            seller: {
                                mail: user.data.mail,
                                username: user.data.username
                            },
                            logged: true,
                            userData: req.userData
                        });
                    } else {
                        res.status(200);
                        res.render('single-annonce', {
                            title: carData.car.brand + ' ' + carData.car.model,
                            annonce: carData,
                            seller: {
                                mail: user.data.mail,
                                username: user.data.username
                            },
                        });
                    }

                })
                .catch(() => res.status(500).json({'message': 'Internal server error (500)'}));
            console.log(carData);
        })
        .catch(() => res.status(404).render('404', {title: '404'}));
});


//Ajouter annonce
views.get('/ajouter-une-annonce', async (req, res) => {
    if (req.logged === true) {
        await database.carModel.distinct('brand')
            .then(brands => {
                res.status(200);
                res.render('addAnnonce', {
                    title: 'Ajouter une annonce',
                    brands: brands,
                    logged: true,
                    userData: req.userData
                });
            })
            .catch(err => {
                res.status(500);
                res.json({"message": err.message});
            });
    } else {
        res.status(301).redirect('/connexion');
    }


});

module.exports = views;