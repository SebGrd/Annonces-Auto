const mongoose = require('mongoose');
const clc = require('cli-color');
const logOk = clc.green.bold;


const Car = mongoose.model(
    'Car',
    {
        brand: String,
        model: String
    }
);
exports.carModel = Car;

exports.connect = () => {
    mongoose.connect(
        'mongodb+srv://' + process.env.MONGOUSER + ':' + process.env.MONGOPASS + '@' + process.env.MONGOURL + '/' + process.env.MONGO_DB_CARS,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(value => {
            console.log(logOk('MongoDB Connected'));
        })
        .catch(error => {
            console.log(error);
        });
};

exports.getCar = (req, res, next) => {



};
