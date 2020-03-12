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