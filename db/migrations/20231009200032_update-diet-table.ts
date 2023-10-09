import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.text('date').notNullable().alter()
    table.text('time').notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diet', (table) => {
    table.dateTime('date').notNullable().alter()
    table.time('time').notNullable().alter()
  })
}
