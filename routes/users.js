const express = require('express');
const user = express.Router();
const utils = require('../utils/utils');
const { getUsers, postUsers } = require('../middlewares/users');

user.get('/', utils.apiRights, getUsers, (req, res, next) => {
   res.status(200);
   res.json(req.users);
});

user.post('/', utils.apiRights, postUsers, (req, res, next) => {
   res.status(200);
   res.json(req.user);
});

module.exports = user;