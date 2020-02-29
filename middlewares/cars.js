const database = require('./../utils/db');

/***
 * Car params
 */
class carQuery {
    constructor(brand, model) {
        if (brand){this.brand = brand}
        if (model){this.model = model}
    }
}


//Return cars
exports.getCar = (req, res, next) => {
    console.log('middleWare: getCar');

    /**
     * Création du nouvel objet qui contient les paramètres
     * @type {carQuery}
     */
    let newQuery = new carQuery(req.query.id, req.query.brand, req.query.model);

    console.log(newQuery);

    database.carModel.find(newQuery, (err, cars) => {
        if (err) { //SI ERREUR INTERNE
            console.log(err);
            res.status(500)
                .json({"error": "Internal server error"});

        } else if (cars.length){ //SINON SI ELEMENT TROUVED
            req.cars = cars;
            next();

        } else{ //SINON AUCUN ELEMENT TROUVED
            res.status(404)
                .json({ "message" : "No car found for : " + JSON.stringify(newQuery)})
        }
    })


};

//Insert car
exports.postCar = (req, res, next) => {
    console.log('middleWare: postCar');


    if (req.body.brand && req.body.model){
        let newQuery = new carQuery(req.body.brand, req.body.model);

        console.log(newQuery);

        let newCar = new database.carModel(newQuery);

        newCar.save( (err, car) => {
            if (err) { //SI ERREUR INTERNE
                console.log('err new car');
                console.log(err);
                res.status(500)
                    .json({"error": "Internal server error"});

            } else { //SINON SI ELEMENT TROUVED
                console.log(car);
                req.car = car;
                next();
            }
        })

    } else{
        res.status(500);
        res.json({"message": "Not all required params given"})
    }



};
