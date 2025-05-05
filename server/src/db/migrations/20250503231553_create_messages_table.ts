import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table
      .integer("sender_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("receiver_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("listing_id")
      .unsigned()
      .references("id")
      .inTable("listings")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("messages");
}
