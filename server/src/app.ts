import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./services/passportServices";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import listingRoutes from "./routes/listings";
import userRoutes from "./routes/users";
import reviewRoutes from "./routes/reviews";

app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
export default app;
