const jwt = require('jsonwebtoken');

exports.apiRights = (req, res, next) => {
    if (req.header('x-api-key') === process.env.API_KEY){
        next();
    } else {
        res.status(401);
        res.json({"error": "No permission"});
    }
};

exports.authenticate = (req, res, next) => {
    const token = req.signedCookies['jwt'];
    if (token === null ) return next();

    jwt.verify(token, process.env.JWT_SECRET, ((err, decoded) => {
        if (err) return next();

        req.logged = true;
        req.userData = decoded;
        next();
    }))
};

function objToUpdateMongoose(obj, newObj={}, prefix=""){
    for(let key in obj) {
        if (typeof obj[key] === "object") {
            objToUpdateMongoose(obj[key], newObj, prefix + key + ".");
        } else {
            newObj[prefix + key] = obj[key];
        }
    }
    return newObj;
};

exports.objToUpdateMongoose = objToUpdateMongoose;