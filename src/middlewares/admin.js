const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function admin(request, response, next) {
    const user_id = request.user.id;

    const user = await knex('users').where({ id: user_id }).first();

    if (!user.is_admin) {
        throw new AppError('Acesso negado', 403);
    }

    return next();
}

module.exports = admin;