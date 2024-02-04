const knex = require('../database/knex');
const Storage = require('../providers/Storage');
const AppError = require('../utils/AppError');

class DishesController {
    async create(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const image = request.file.filename;
        const user_id = request.user.id;

        const storage = new Storage();
        const filename = await storage.save(image);

        const ingredientsArray = JSON.parse(ingredients || '[]');

        const [dish_id] = await knex('dishes').insert({
            name,
            description,
            category,
            price,
            image: filename,
            created_by: user_id,
            updated_by: user_id
        });

        const ingredientsData = ingredientsArray.map((name) => {
            return {
                dish_id,
                name,
                created_by: user_id,
            };
        });

        await knex('ingredients').insert(ingredientsData);

        return response.status(201).json();
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex('dishes').where({ id }).first();
        const ingredients = await knex('ingredients').where({ dish_id: id }).orderBy('name');

        return response.json({ ...dish, ingredients });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex('dishes').where({ id }).delete();

        return response.status(204).json();
    }

    async update(request, response) {
        const { id } = request.params;
        const { name, description, category, price, ingredients } = request.body;
        const image = request.file?.filename;

        const dish = await knex('dishes').where({ id }).first();

        if (!dish) {
            throw new AppError('Prato não encontrado', 404);
        }

        const newDish = {
            name: name ?? dish.name,
            description: description ?? dish.description,
            category: category ?? dish.category,
            price: price ?? dish.price,
            updated_by: request.user.id,
            updated_at: knex.fn.now()
        }

        if (image) {
            const storage = new Storage();

            if (dish.image) {
                await storage.delete(dish.image);
            }

            const file = await storage.save(image);
            newDish.image = file;
        }

        if (ingredients) {
            await knex('ingredients').where({ dish_id: id }).delete();



            const ingredientsData = JSON.parse(ingredients || '[]').map((name) => {
                return {
                    dish_id: id,
                    name,
                    created_by: dish.created_by,
                }
            });

            await knex('ingredients').insert(ingredientsData);
        }

        await knex('dishes').where({ id }).update(newDish);

        return response.status(204).json();
    }

    async index(request, response) {
        const { search } = request.query;

        let dishes;

        if (search) {
            const keywords = search.split(' ').map((word) => `%${word}%`);

            dishes = await knex('dishes').select([
                'dishes.id',
                'dishes.name',
                'dishes.description',
                'dishes.category',
                'dishes.price',
                'dishes.image',
            ]).leftJoin(
                'ingredients',
                'dishes.id',
                'ingredients.dish_id'
            ).where((builder) => {
                builder.where((builder2) => {
                    keywords.forEach((keyword) => {
                        builder2.orWhere('dishes.name', 'like', keyword);
                        builder2.orWhere('dishes.description', 'like', keyword);
                    });
                });
                keywords.forEach((keyword) => {
                    builder.orWhere('ingredients.name', 'like', keyword);
                });
            }).groupBy('dishes.id').orderBy('dishes.name');
        } else {
            dishes = await knex('dishes').select([
                'dishes.id',
                'dishes.name',
                'dishes.description',
                'dishes.category',
                'dishes.price',
                'dishes.image'
            ]).orderBy('dishes.name');
        }

        const allIngredients = await knex('ingredients');
        const ingredientsInDishes = dishes.map((dish) => {
            const dishIngredients = allIngredients.filter((ingredient) => ingredient.dish_id == dish.id);

            return {
                ...dish,
                ingredients: dishIngredients
            }
        });

        return response.json(ingredientsInDishes);
    }
}

module.exports = DishesController;