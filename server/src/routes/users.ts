import express from "express";
import { signup, signin, viewUserProfile } from "../controllers/users";

const router = express.Router();

import { requireAuth, requireLogin } from "../services/passportAuth";

// Auth routes
router.post("/signup", signup);
router.post("/signin", requireLogin, signin);

// User profile routes
router.get("/users/:id", requireAuth, viewUserProfile); // View user profile

export default router;
