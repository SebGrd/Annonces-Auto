const express = require('express');
const car = express.Router();
const utils = require('./../utils');

// Ajout d'une voiture
car.post('/:id', utils.isAdmin, (req, res) => {
    res.status(200);
    res.send(req.params.id);
});


car.get('/:id', (req, res) => {
    res.status(200);
    res.send(req.params.id);
});

car.delete('/:id', utils.isAdmin, (req, res) => {
    res.status(200);
    res.send(req.params.id);
});

module.exports = car;