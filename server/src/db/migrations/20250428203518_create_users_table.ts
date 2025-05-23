import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").unique().notNullable();
    table.string("email").unique().notNullable();
    table.string("hashedPassword").notNullable();
    table.string("signed_agreement").notNullable().defaultTo("false");
    table.enum("role", ["admin", "user"]).defaultTo("user").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
