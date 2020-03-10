const database = require('./../utils/db');

//Return cars
exports.getAnnonce = (req, res, next) => {

    database.annonceModel.find(req.body)
        .then((annonces) => {
            if (annonces.length) {
                req.annonces = annonces;
                next();
            } else {
                res.status(404);
                res.json({"message": "No posts found for : " + JSON.stringify(req.body)});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"error": "Internal server error"});
        });
};

//Return cars
exports.postAnnonce = (req, res, next) => {


    let expectedAnnonce = [
        'user', 'content', 'price', 'car',
        'brand', 'model', 'details',
        'version',
        'color',
        'places',
        'doors',
        'km',
        'energy',
        'productionYear',
        'transmission',
        'hp',
        'cf'
    ];

    next();
};