const express = require('express');
const user = express.Router();
const utils = require('../utils/utils');
const { getUsers, postUsers, deleteUsers } = require('../middlewares/users');

user.get('/', utils.apiRights, getUsers, (req, res, next) => {
   res.status(200);
   res.json(req.users);
});

user.post('/', utils.apiRights, postUsers, (req, res, next) => {
   res.status(200);
   res.json(req.user);
});

user.delete('/:id', utils.apiRights, deleteUsers, (req, res, next) => {
   res.status(200);
   res.json({"message": "user deleted"});
});

module.exports = user;