const database = require('./../utils/db');
const { objToUpdateMongoose } = require('./../utils/utils');
const bcrypt = require('bcrypt');

exports.getUsers = (req, res, next) => {
    database.userModel.find(req.body)
        .then((users) => {
            if (users.length) {
                req.users = users;
                next();
            } else {
                res.status(404);
                res.json({"message": "No users found for : " + JSON.stringify(req.body)});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"error": "Internal server error"});
        });
};

exports.postUsers = (req, res, next) => {
    if (req.body.password){
        bcrypt.hash(req.body.password, 10)
            .then( hashed =>{
               req.body.password = hashed;

                let newUser = new database.userModel(req.body);
                newUser.save()
                    .then(user => {
                        req.user = user;
                        next();
                    })
                    .catch((err) => {
                        if (err.code === 11000){
                            res.status(500);
                            res.json({"message": "Duplicated value", "code": err.code});
                        } else {
                            console.log(err);
                            res.status(500);
                            res.json({"message": err.message});
                        }
                    });

            })
            .catch(err =>{
                console.log(err);
                res.status(500);
                res.json({"message": "Internal server error"});
            });
    } else{
        res.status(500);
        res.json({"message": "Password missing"});
    }
};

exports.updateUsers = (req, res, next) => {

    if (req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/)) { //SI OBJECT ID

        async function cryptObjectProperty(object, property){
            if (object[property]){
                let encrypt = new Promise( (hashed, err) => {
                    bcrypt.hash(object[property], 10)
                        .then( hash => {
                            object[property] = hash;
                            hashed(object);
                        })
                        .catch(err =>{
                            console.log(err);
                        });
                });
                return await encrypt;
            } else {
                return object;
            }
        }

        cryptObjectProperty(req.body, 'password')
            .then( hashedObject => {
                const mongooseData = objToUpdateMongoose(hashedObject);
                database.userModel.findByIdAndUpdate(req.params.id, {$set: mongooseData}, {new: true})
                    .then((user) => {
                        req.modifs = user;
                        next();
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500);
                        res.json({"error": "Internal server error"});
                    });

            })
            .catch( err => {
                console.log(err);
            });

    } else {
        res.status(500);
        res.json({"error": "No objectID given"});
    }
};


exports.deleteUsers = (req, res, next) => {
    if (req.params.id && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        database.userModel.findByIdAndDelete(req.params.id)
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