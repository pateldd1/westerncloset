import express from "express";
import multer from "multer";
import {
  createListing,
  getListings,
  getUserListings,
  deleteListing,
  updateListing,
  getListingById,
} from "../controllers/listings";
import { requireAuth } from "../services/passportAuth"; // Assuming you have a passport service for authentication

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // later replace with S3 or Cloudinary

router.post("/", requireAuth, upload.single("image"), createListing);
router.get("/", getListings);
router.get("/my-listings", requireAuth, getUserListings);
router.delete("/:id", requireAuth, deleteListing);
router.patch("/:id", requireAuth, updateListing);
router.get("/:id", getListingById);

export default router;
