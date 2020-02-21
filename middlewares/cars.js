const database = require('./../utils/db');

exports.getCar = (req, res, next) => {

    let objectQuery = {}; //Création de l'objet de retour

    if (req.query.brand && !req.query.model){ //Si y'a que la marque :
        objectQuery.brand = req.query.brand; //Ajout de la marque
    }

    if (req.query.model && !req.query.brand){ //Si y'a que le modèle :
        objectQuery.model = req.query.model; //Ajout du modèle
    }

    if (req.query.brand && req.query.model){ //Si y'a la marque et le modèle :
        objectQuery.brand = req.query.brand; //Ajout de la marque
        objectQuery.model = req.query.model; //Ajout du modeèle la marque
    }

    console.log(objectQuery);

    database.carModel.find(objectQuery, (err, cars) => {
        if (err) { //SI ERREUR INTERNE
            console.log(err);
            res.status(500)
                .json({"error": "Internal server error"});
        } else if (cars.length){ //SINON SI ELEMENT TROUVED
            res.status(200);
            res.json(cars);
        } else{ //SINON AUCUN ELEMENT TROUVED
            res.status(404)
                .json({ "message" : "No car found for : " + req.query.brand}) //@todo return undefined
        }
    })


};
