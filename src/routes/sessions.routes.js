const { Router } = require('express');

const Controller = require('../controllers/SessionsController');

const sessions = Router();
const sessionsController = new Controller();

sessions.post('/', sessionsController.create);

module.exports = sessions;