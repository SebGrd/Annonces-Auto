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
    if (req.query.brand){
        console.log(req.query.brand);
    } else {
        console.log('No brand given')
    }
    if (req.query.model){
        console.log(req.query.model);
    } else {
        console.log('No model given')
    }
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
});

car.delete('/:id', utils.isAdmin, (req, res) => {
    res.status(200);
    res.send(req.params.id);
});

module.exports = car;