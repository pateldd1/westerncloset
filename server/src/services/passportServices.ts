import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../services/users";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Type-safe secret
const secret: string | undefined = process.env.SECRET;
if (!secret) {
  throw new Error("SECRET environment variable is not defined");
}

// --------------------
// Local Strategy
// --------------------

const localOptions = {
  usernameField: "email",
};

const localStrategy = new LocalStrategy(
  localOptions,
  async (email: string, password: string, done: any) => {
    try {
      const user = await User.queryOne({ email });
      if (!user) {
        return done(null, false, {
          message: "Wrong email/password combination",
        });
      }

      const isMatch = await User.comparePassword(password, user.hashedPassword);
      if (!isMatch) {
        return done(null, false, {
          message: "Wrong email/password combination",
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

// --------------------
// JWT Strategy
// --------------------

interface JwtPayload {
  userId: number;
  exp: number;
  iat: number;
  username?: string;
  role?: string;
}

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: JwtPayload, done) => {
    try {
      if (Date.now() >= payload.exp * 1000) {
        return done(null, false, { message: "JWT expired" });
      }

      const user = await User.queryOne({ id: payload.userId });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

// --------------------
// Apply Strategies
// --------------------

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
