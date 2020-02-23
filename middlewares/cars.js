const database = require('./../utils/db');

/** retourne les voiutres */
exports.getCar = (req, res, next) => {

    /**
     * Class qui gère les paramètres de la recherche
     */
    class carQuery {
        constructor(id, brand, model) {
            if (id){this.id = id}
            if (brand){this.brand = brand}
            if (model){this.model = model}
        }
    }

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
