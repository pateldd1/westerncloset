import db from "../db/knex";
import { Listing, ListingQueryParams } from "../types/listings";

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

  async filterAndFetchListings(params: ListingQueryParams) {
    let query = db("listings");

    // Search
    if (params.search) {
      const term = `%${params.search}%`;
      query = query.where(function () {
        this.where("title", "ilike", term).orWhere(
          "description",
          "ilike",
          term
        );
      });
    }

    // Category
    if (params.category && params.category !== "all") {
      query = query.andWhere("category", params.category);
    }

    // Price range
    if (params.minPrice) {
      query = query.andWhere("price", ">=", params.minPrice);
    }
    if (params.maxPrice) {
      query = query.andWhere("price", "<=", params.maxPrice);
    }

    // Sorting
    switch (params.sort) {
      case "price-asc":
        query = query.orderBy("price", "asc");
        break;
      case "price-desc":
        query = query.orderBy("price", "desc");
        break;
      case "newest":
        query = query.orderBy("id", "desc");
        break;
      case "oldest":
        query = query.orderBy("id", "asc");
        break;
    }

    return query.select("*");
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
