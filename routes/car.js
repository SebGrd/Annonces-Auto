const express = require('express');
const car = express.Router();
const utils = require('../utils/utils');
const {postCar, getCar} = require('../middlewares/cars');



// car.use(getCar, postCar);
// get des voitures
car.get('/', getCar, (req, res, next) => {
    res.status(200);
    res.json(req.cars);
});

car.post('/', postCar, (req, res, next) => {
    res.status(200);
    res.json({"message": "Car added", "car" : req.car});
});

// car.delete('/:id', utils.isAdmin, (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });

module.exports = car;