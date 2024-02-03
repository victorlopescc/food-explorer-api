const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const { compare } = require('bcryptjs');
const auth = require('../configs/auth');
const { sign } = require('jsonwebtoken');

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        const user = await knex('users').where({ email }).first();

        if (!user) {
            throw new AppError('Email ou senha incorretos', 401);
        }

        const match = await compare(password, user.password);

        if (!match) {
            throw new AppError('Email ou senha incorretos', 401);
        }

        const { secret, expiresIn } = auth.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        });

        return response.status(200).json({ user, token });
    }
}

module.exports = SessionsController;