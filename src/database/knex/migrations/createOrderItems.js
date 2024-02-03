exports.up = knex => knex.schema.createTable('order_items', table => {
    table.increments('id');

    table.text('name').notNullable();
    table.integer('quantity').notNullable();

    table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.integer('dish_id').references('id').inTable('dishes');
});

exports.down = knex => knex.schema.dropTable('order_items');