const express = require('express');
const annonce = express.Router();
const utils = require('../utils/utils');
const { getAnnonce, postAnnonce, updateAnnonce, deleteAnnonce } = require('../middlewares/annonces');

annonce.get('/', getAnnonce, (req, res, next) => {
   res.status(200);
   res.json(req.annonces);
});

annonce.post('/', utils.apiRights, postAnnonce, (req, res, next) => {
   res.status(201);
   res.json({"message": "annonce created", "annonce": req.annonce});
});

annonce.put('/:id', utils.apiRights, updateAnnonce, (req, res, next) => {
   res.status(200);
   res.json({"message": "annonce updated", "modifs": req.modifs});
});

annonce.delete('/:id', utils.apiRights, deleteAnnonce, (req, res, next) => {
   res.status(200);
   res.json({"message": "annonce deleted"});
});


module.exports = annonce;