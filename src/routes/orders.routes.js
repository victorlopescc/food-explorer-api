const { Router } = require('express');

const Controller = require('../controllers/OrdersController');
const authenticated = require('../middlewares/authenticated');
const admin = require('../middlewares/admin');

const orders = Router();
const ordersController = new Controller();

orders.use(authenticated);

orders.post('/', ordersController.create);
orders.get('/', ordersController.index);
orders.get('/:id', ordersController.show);
orders.patch('/:id', admin, ordersController.update)
orders.delete('/:id', admin, ordersController.delete);

module.exports = orders;