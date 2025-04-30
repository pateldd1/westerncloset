import db from "../db/knex";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../services/users";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
  exp: number;
  iat: number;
  username?: string;
  role?: string;
}
// View user's profile
export const viewUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await db("users").where("id", id).first();

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Omit password or sensitive fields
    const { password, ...userData } = user;
    res.json(userData);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const decodedToken: JwtPayload = jwtDecode(
    req.headers.authorization as string
  );
  const { role } = decodedToken;
  if (role === "admin") {
    // User is an admin, continue to the next middleware/route handler
    next();
  } else {
    // User is not an admin, return a 403 Forbidden error
    res
      .status(403)
      .json({ message: "Access denied. Admin permission required." });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  console.log("Signup request body: ", req.body);
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    res.status(400).json({
      message: "Username can only contain letters and numbers",
    });
    return;
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) {
    res.status(400).json({
      message:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    });
    return;
  }
  console.log(username, email, password);
  try {
    const existingUser = await User.queryOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(username, email, hashedPassword);
    const token = jwt.sign(
      { userId: newUser[0].id, username: newUser[0].username },
      process.env.SECRET as string,
      { algorithm: "HS256" }
    );
    // const decodedToken = jwt.verify(token, process.env.SECRET);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error signing up: ", error);
    res.status(500).json({ message: "Error signing up" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.queryOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.SECRET as string
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error signing in: ", error);
    res.status(500).json({ message: "Error signing in" });
  }
};
