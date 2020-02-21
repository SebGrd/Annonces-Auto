const express = require('express');
const annonce = express.Router();
const utils = require('../utils/utils');

// // Ajout d'une annonce
// annonce.post('/:id', utils.isAdmin, (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });
//
// // Récuperer une annonce
// annonce.get('/:id', (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });
//
// // Ajout d'une annonce
// annonce.patch('/:id', utils.isAdmin, (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });
//
// // Supprimer une annonce
// annonce.delete('/:id', utils.isAdmin, (req, res) => {
//     res.status(200);
//     res.send(req.params.id);
// });

module.exports = annonce;