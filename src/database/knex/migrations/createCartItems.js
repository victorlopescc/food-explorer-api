exports.up = knex => knex.schema.createTable('cart_items', table => {
    table.increments('id');

    table.text('name').notNullable();
    table.integer('quantity').notNullable();

    table.integer('cart_id').references('id').inTable('carts').onDelete('CASCADE');
    table.integer('dish_id').references('id').inTable('dishes');
});

exports.down = knex => knex.schema.dropTable('cart_items');
