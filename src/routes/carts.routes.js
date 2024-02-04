const { Router } = require('express');

const Controller = require('../controllers/CartsController');
const authenticated = require('../middlewares/authenticated');

const carts = Router();
const cartsController = new Controller();

carts.use(authenticated);

carts.post('/', cartsController.create);
carts.get('/', cartsController.index);
carts.get('/:id', cartsController.show);
carts.patch('/:id', cartsController.update);
carts.delete('/:id', cartsController.delete);

module.exports = carts;