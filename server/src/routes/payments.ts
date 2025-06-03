import express from "express";
import { createCheckoutSession } from "../controllers/payments";

const router = express.Router();

router.post("/checkout-session", createCheckoutSession);

export default router;
