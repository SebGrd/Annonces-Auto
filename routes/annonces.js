const express = require('express');
const annonce = express.Router();
const utils = require('../utils/utils');
const { getAnnonce } = require('../middlewares/annonces');

annonce.get('/', getAnnonce, (req, res, next) => {
   res.status(200);
   res.json(req.annonces);
});

module.exports = annonce;