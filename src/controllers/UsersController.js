const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UsersController {
    async create(request, response) {
        const { name, email, password, is_admin = false } = request.body;

        const userExists = await knex('users').where({ email }).first();
        if (userExists) {
            throw new AppError('Email já cadastrado', 400);
        }

        const passwordHash = await hash(password, 8);

        await knex('users').insert({
            name,
            email,
            password: passwordHash,
            is_admin
        });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password, is_admin } = request.body;
        const user_id = request.user.id;

        const user = await knex('users').where({ id: user_id }).first();

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        const userEmail = await knex('users').where({ email }).first();

        if (userEmail && userEmail.id !== user_id) {
            throw new AppError('Email já cadastrado', 400);
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError('Informe a senha antiga', 400);
        }

        if (password && old_password) {
            const check = await compare(old_password, user.password);

            if (!check) {
                throw new AppError('As senhas não conferem', 400);
            }

            user.password = await hash(password, 8);
        }

        if (is_admin !== undefined && user.id !== request.userId && !user.is_admin) {
            throw new AppError('Acesso negado', 403);
        }

        await knex('users').where({ id: user_id }).update({
            name: user.name,
            email: user.email,
            password: user.password,
            is_admin: user.is_admin,
            updated_at: knex.fn.now()
        });

        return response.status(200).json();
    }
}

module.exports = UsersController;