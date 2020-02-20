const express = require('express');
const car = express.Router();
const utils = require('./../utils');
const database = require('./../middlewares/mongoose');

// Ajout d'une voiture
car.post('/:id', utils.isAdmin, (req, res) => {
    res.status(200);
    res.send(req.params.id);
});


car.get('/', (req, res) => {
    if (req.query.brand && !req.query.model){
        database.carModel.find({brand: req.query.brand}, (err, cars) => {
            if (err) { //SI ERREUR INTERNE
                console.log(err);
                res.status(500)
                    .json({"error": "Internal server error"});
            } else if (cars.length){ //SINON SI ELEMENT TROUVED
                res.status(200);
                res.send(cars);
            } else{ //SINON AUCUN ELEMENT TROUVED
                res.status(404)
                    .json({ "message" : "No car found for : " + req.query.brand})
            }
        });
    }
    if (req.query.model && !req.query.brand){
        database.carModel.find({model: req.query.model}, (err, cars) => {
            if (err) { //SI ERREUR INTERNE
                console.log(err);
                res.status(500)
                    .json({"error": "Internal server error"});
            } else if (cars.length){ //SINON SI ELEMENT TROUVED
                res.status(200);
                res.send(cars);
            } else{ //SINON AUCUN ELEMENT TROUVED
                res.status(404)
                    .json({ "message" : "No car found for : " + req.query.model})
            }
        });
    }
    if (req.query.brand && req.query.model){
        database.carModel.find({brand: req.query.brand, model: req.query.model}, (err, cars) => {
            if (err) { //SI ERREUR INTERNE
                console.log(err);
                res.status(500)
                    .json({"error": "Internal server error"});
            } else if (cars.length){ //SINON SI ELEMENT TROUVED
                res.status(200);
                res.send(cars);
            } else{ //SINON AUCUN ELEMENT TROUVED
                res.status(404)
                    .json({ "message" : "No car found for : " + req.query.model})
            }
        });
    }
});

car.delete('/:id', utils.isAdmin, (req, res) => {
    res.status(200);
    res.send(req.params.id);
});

module.exports = car;