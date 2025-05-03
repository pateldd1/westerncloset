import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table
      .integer("reviewer_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("seller_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.integer("rating").notNullable(); // 1–5
    table.text("comment");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("reviews");
}
