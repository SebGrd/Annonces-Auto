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