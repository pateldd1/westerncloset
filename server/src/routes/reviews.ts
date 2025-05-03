import express from "express";
import { createReview, getReviewsForSeller } from "../controllers/reviews";
import { requireAuth } from "../services/passportAuth";

const router = express.Router();

router.post("/", requireAuth, createReview);
router.get("/:sellerId", getReviewsForSeller);

export default router;
