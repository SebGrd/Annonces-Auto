const database = require('./../utils/db');
const mongoose = require('mongoose');

/***
 * Car params
 */
class carQuery {
    constructor(brand, model) {
        if (brand) {
            this.brand = brand
        }
        if (model) {
            this.model = model
        }
    }
}


//Return cars
exports.getCar = (req, res, next) => {

    let car = {};
    req.query.id ? car._id = req.query.id : null;
    req.query.brand ? car.brand = req.query.brand : null;
    req.query.model ? car.model = req.query.model : null;

    database.carModel.find(car)
        .then((cars) => {
            if (cars.length) { //SI ELEMENT TROUVED
                req.cars = cars;
                next();
            } else { //SINON AUCUN ELEMENT TROUVED
                res.status(404)
                    .json({"message": "No car found for : " + JSON.stringify(car)})
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"error": "Internal server error"});
        });
};

//Insert car
exports.postCar = (req, res, next) => {

    let car = {};
    if (req.body.brand && req.body.model) {
        car.brand = req.body.brand;
        car.model = req.body.model;
    } else {
        res.status(500);
        res.json({"message": "Not all required params given"});
        return null;
    }

    let newCar = new database.carModel(car);
    newCar.save()
        .then((car)=>{
            console.log(car);
            req.car = car;
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"error": "Internal server error"});
        })
};


//Delete car
exports.deleteCar = (req, res, next) => {
    console.log('middleWare: deleteCar');

    if (req.params.id) {


        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) { //SI OBJECT ID

            database.carModel.findByIdAndDelete(req.params.id)
                .then((car) => {
                    console.log(car);
                    req.cars = car;
                    next();
                }).catch((err) => {
                console.log(err);
                res.status(500);
                res.json({"error": "Internal server error"});
            });

        } else {
            res.status(500);
            res.json({"error": "Not objectID given"});
        }

    } else {
        res.status(404);
        res.json({"message": "No ID given"})
    }

};


//UPDATE CAR
exports.updateCar = (req, res, next) => {
    console.log('middleWare: updateCar');

    if (req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/)) { //SI OBJECT ID

        database.carModel.findById(req.params.id)
            .then((car) => {
                car.brand = req.body.brand ? req.body.brand : car.brand;
                car.model = req.body.model ? req.body.model : car.model;

                car.save()
                    .then(() => {
                        console.log('Car updated : ' + car);
                    })
                    .catch((err) => {
                        console.log(err)
                    });

                req.cars = car;
                next();

            })
            .catch((err) => {
                console.log(err);
                res.status(500);
                res.json({"error": "Internal server error"});
            });

    } else {
        res.status(500);
        res.json({"error": "No objectID given"});
    }
};
