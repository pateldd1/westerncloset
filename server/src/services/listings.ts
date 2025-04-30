import db from "../db/knex";
import { Listing } from "../types/listings";

const ListingService = {
  async create(
    data: Omit<Listing, "id" | "seller_username" | "seller_email">
  ): Promise<Listing> {
    const [listing] = await db("listings").insert(data).returning("*");
    return listing;
  },

  async findAll(): Promise<Listing[]> {
    return db("listings").select("*");
  },

  async findById(id: number): Promise<Listing | undefined> {
    return db("listings")
      .join("users", "listings.seller_id", "users.id")
      .select(
        "listings.*",
        "users.username as seller_username",
        "users.email as seller_email"
      )
      .where("listings.id", id)
      .first();
  },

  async findByUserId(userId: number): Promise<Listing[]> {
    return db("listings")
      .where("seller_id", userId)
      .select("*")
      .orderBy("id", "desc");
  },

  async findOwnedListing(id: number, userId: number): Promise<Listing | null> {
    const listing = await db("listings").where({ id }).first();
    if (!listing || listing.seller_id !== userId) return null;
    return listing;
  },

  async update(id: number, updates: Partial<Listing>): Promise<Listing> {
    const [updated] = await db("listings")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  },

  async delete(id: number): Promise<number> {
    return db("listings").where({ id }).delete();
  },
};

export default ListingService;
