import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diet', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.datetime('date').notNullable()
    table.time('time').notNullable()
    table.boolean('is_on_diet').notNullable()
    table.uuid('user_id').unsigned()
    table.foreign('user_id').references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at')
    table.timestamp('deleted_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diet')
}
