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

    let newAnnonce = new database.annonceModel(req.body);
    newAnnonce.save()
        .then((annonce)=>{
            console.log(annonce);
            req.annonce = annonce;
            next();
        })
        .catch((err)=>{
           console.log(err);
           res.status(500);
           res.json({"message": "Internal server error"});
        });
};