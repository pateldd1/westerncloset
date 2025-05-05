import express from "express";
import {
  sendMessage,
  getMessagesForListing,
  getSellerInbox,
  getBuyerInbox,
} from "../controllers/messages";
import { requireAuth } from "../services/passportAuth";

const router = express.Router();

router.post("/", requireAuth, sendMessage);
router.get("/:listingId", requireAuth, getMessagesForListing);

router.get("/inbox/sellerInbox", requireAuth, getSellerInbox);
router.get("/inbox/buyerInbox", requireAuth, getBuyerInbox);

export default router;
