exports.apiRights = (req, res, next) => {
    if (req.header('api_key') === process.env.API_KEY){
        next();
    } else {
        res.status(401);
        res.json({"error": "No permission"});
    }
};
//
// function objToUpdateMongoose(obj, newObj={}, prefix=""){
//     for(let key in obj) {
//         if (typeof obj[key] === "object") {
//             objToUpdateMongoose(obj[key], newObj, prefix + key + ".");
//         } else {
//             newObj[prefix + key] = obj[key];
//         }
//     }
//     return newObj;
// };
//
// exports.objToUpdateMongoose = objToUpdateMongoose;