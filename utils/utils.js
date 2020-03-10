exports.apiRights = (req, res, next) => {
    if (req.header('api_key') === process.env.API_KEY){
        next();
    } else {
        res.status(401);
        res.json({"error": "No permission"});
    }
};