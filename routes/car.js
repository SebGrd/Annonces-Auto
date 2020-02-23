const express = require('express');
const car = express.Router();
const utils = require('../utils/utils');
const cars = require('../middlewares/cars');



car.use(cars.getCar);
// get des voitures
car.get('/', cars.getCar, (req, res, next) => {
    res.status(200);
    res.json(req.cars);
});

// car.delete('/:id', utils.isAdmin, (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });

module.exports = car;