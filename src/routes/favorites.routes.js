const { Router } = require('express');

const Controller = require('../controllers/FavoritesController');
const authenticated = require('../middlewares/authenticated');

const favorites = Router();
const favoritesController = new Controller();

favorites.use(authenticated);

favorites.get('/', favoritesController.index);
favorites.post('/', favoritesController.create);
favorites.delete('/:dish_id', favoritesController.delete);

module.exports = favorites;