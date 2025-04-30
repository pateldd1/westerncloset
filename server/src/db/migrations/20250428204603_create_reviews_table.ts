import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.integer("rating").notNullable();
    table.text("comment");
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("proeduct_id")
      .references("id")
      .inTable("listings")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reviews");
}
