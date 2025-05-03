import db from "../db/knex";
import { Review } from "../types/reviews";

const ReviewService = {
  async create({
    reviewer_id,
    seller_id,
    rating,
    comment,
  }: Partial<Review>): Promise<Review> {
    const [review] = await db("reviews")
      .insert({ reviewer_id, seller_id, rating, comment })
      .returning("*");
    return review;
  },

  async getBySellerId(seller_id: number): Promise<Review[]> {
    return db("reviews")
      .join("users", "reviews.reviewer_id", "users.id")
      .select("reviews.*", "users.username as reviewer_username")
      .where({ seller_id })
      .orderBy("created_at", "desc");
  },

  async getAverageRating(seller_id: number): Promise<number | null> {
    const result = await db("reviews")
      .where({ seller_id })
      .avg("rating as avg_rating")
      .first();
    const avg = result?.avg_rating;
    return avg !== null && avg !== undefined ? parseFloat(avg) : null;
  },
};

export default ReviewService;
