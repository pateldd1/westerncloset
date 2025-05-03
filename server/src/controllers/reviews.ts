import { Request, Response } from "express";
import ReviewService from "../services/reviews";
import { Review } from "../types/reviews";

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sellerId, rating, comment } = req.body;
  const reviewer_id = req.user?.id;

  if (!reviewer_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!sellerId || !rating) {
    res.status(400).json({ error: "Missing seller_id or rating" });
    return;
  }

  try {
    const review: Review = await ReviewService.create({
      reviewer_id,
      seller_id: sellerId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const getReviewsForSeller = async (
  req: Request,
  res: Response
): Promise<void> => {
  const seller_id = parseInt(req.params.sellerId);

  try {
    const reviews: Review[] = await ReviewService.getBySellerId(seller_id);
    const avg: number | null = await ReviewService.getAverageRating(seller_id);
    console.log(avg);
    res.json({ reviews, average: avg });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
