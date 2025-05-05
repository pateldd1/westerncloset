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

  if (reviewer_id === sellerId) {
    res.status(400).json({ error: "You cannot review yourself" });
    return;
  }
  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }
  if (comment && comment.length > 500) {
    res.status(400).json({ error: "Comment is too long" });
    return;
  }
  if (comment && comment.length < 10) {
    res.status(400).json({ error: "Comment is too short" });
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
    res.json({ reviews, average: avg });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
