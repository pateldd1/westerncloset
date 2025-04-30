import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const requireAuth = passport.authenticate("jwt", {
  session: false,
});

export const requireLogin = passport.authenticate("local", { session: false });
