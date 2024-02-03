const { Router } = require('express');

const Controller = require('../controllers/UsersController');
const authenticated = require('../middlewares/authenticated');

const users = Router();
const usersController = new Controller();

users.post('/', usersController.create);
users.put('/', authenticated, usersController.update);

module.exports = users;