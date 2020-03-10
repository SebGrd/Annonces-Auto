const database = require('./../utils/db');

//Return cars
exports.getAnnonce = (req, res, next) => {

    console.log(req.body);

    database.annonceModel.find(req.body)
        .then((annonces) => {
            if (annonces.length) { //SI ELEMENT TROUVED
                req.annonces = annonces;
                next();
            } else { //SINON AUCUN ELEMENT TROUVED
                res.status(404)
                    .json({"message": "No posts found for : " + JSON.stringify(req.body)})
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"error": "Internal server error"});
        });

};