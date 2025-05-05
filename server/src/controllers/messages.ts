import { Request, Response } from "express";
import MessageService from "../services/messages";
import db from "../db/knex";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const { listing_id, content } = req.body;

  if (!user || !listing_id || !content) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  // Find seller (receiver)
  const listing = await db("listings").where({ id: listing_id }).first();
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  const message = await MessageService.send({
    sender_id: user.id,
    receiver_id: listing.seller_id,
    listing_id,
    content,
  });

  res.status(201).json(message);
};

export const getMessagesForListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const listing_id = Number(req.params.listingId);

  if (!user || !listing_id) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const messages = await MessageService.getMessagesForListing(
    listing_id,
    user.id
  );
  res.json(messages);
};

export const getSellerInbox = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const threads = await MessageService.getSellerInbox(req.user.id);
    res.json(threads);
  } catch (err) {
    console.error("❌ Error fetching seller inbox:", err);
    res.status(500).json({ error: "Failed to fetch seller inbox" });
  }
};

export const getBuyerInbox = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const threads = await MessageService.getBuyerInbox(req.user.id);
    res.json(threads);
  } catch (err) {
    console.error("❌ Error fetching buyer inbox:", err);
    res.status(500).json({ error: "Failed to fetch buyer inbox" });
  }
};
