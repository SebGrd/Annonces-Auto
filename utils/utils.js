const isAdmin = (req, res, next) => {
    let admin = true;
    if (admin){
        next();
    } else {
        res.status(401)
            .json({"error" : "No permission"})
    }
};

module.exports = {isAdmin};

const test = (req, res, next) => {
    let test = true;
    if (test){
        console.log(req.query);
        next();
    } else {
        res.status(401)
            .json({"error" : "test error"})
    }
};

module.exports = {test};