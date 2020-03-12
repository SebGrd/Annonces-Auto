const express = require('express');
const user = express.Router();
const utils = require('../utils/utils');
const { getUsers } = require('../middlewares/users');

user.get('/', getUsers, (req, res, next) => {
   res.status(200);
   res.json(req.users);
});

module.exports = user;