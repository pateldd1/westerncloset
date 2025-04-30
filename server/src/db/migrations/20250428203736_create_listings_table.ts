import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("listings", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.decimal("price").notNullable();
    table.string("category").notNullable();
    // Seller ID column
    table
      .integer("seller_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    // Buyer ID column
    table
      .integer("buyer_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL"); // If a buyer is deleted, set the buyer_id to NULL

    table.string("image_key").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("listings");
}
