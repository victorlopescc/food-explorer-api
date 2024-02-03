const { Router } = require('express');

const users = require('./users.routes');
const sessions = require('./sessions.routes');
// const dishes = require('./dishes.routes');
// const orders = require('./orders.routes');
// const carts = require('./carts.routes');
// const favorites = require('./favorites.routes');

const routes = Router();

routes.use('/users', users);
routes.use('/sessions', sessions);
// routes.use('/dishes', dishes);
// routes.use('/orders', orders);
// routes.use('/carts', carts);
// routes.use('/favorites', favorites);

module.exports = routes;