const express = require('express');
const car = express.Router();
const utils = require('../utils/utils');
const {postCar, getCar, deleteCar, updateCar} = require('../middlewares/cars');


car.get('/', getCar, (req, res, next) => {
    res.status(200);
    res.json(req.cars);
});

car.post('/', utils.apiRights, postCar, (req, res, next) => {
    res.status(200);
    res.json({"message": "Car added", "car" : req.car});
});

car.delete('/:id', utils.apiRights, deleteCar, (req, res, next) => {
   res.status(200);
    res.json({"message": "Car deleted", "car" : req.car});
});

car.put('/:id', utils.apiRights, updateCar, (req, res, next) => {
   res.status(200);
   res.json({"message": "Car updated", "car": req.car})
});

module.exports = car;