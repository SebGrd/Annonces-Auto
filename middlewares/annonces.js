const database = require('./../utils/db');
const {objToUpdateMongoose} = require('./../utils/utils');

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

exports.postAnnonce = (req, res, next) => {

    let newAnnonce = new database.annonceModel(req.body);
    newAnnonce.save()
        .then((annonce) => {
            req.annonce = annonce;
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"message": "Internal server error"});
        });
};

exports.updateAnnonce = (req, res, next) => {

    if (req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/)) { //SI OBJECT ID

        const mongooseData = objToUpdateMongoose(req.body);

        database.annonceModel.findByIdAndUpdate(req.params.id, {$set: mongooseData}, {new: true})
            .then((annonce) => {
                req.modifs = annonce;
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


exports.deleteAnnonce = (req, res, next) => {
    if (req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        database.annonceModel.findByIdAndDelete(req.params.id)
            .then(() => {
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