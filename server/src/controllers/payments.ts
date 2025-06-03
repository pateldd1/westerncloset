import { Request, Response } from "express";
import db from "../db/knex";
import stripe from "../services/stripe";

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { listingId } = req.body;

  if (!listingId) {
    res.status(400).json({ error: "Missing listing ID" });
    return;
  }

  const listing = await db("listings").where({ id: listingId }).first();

  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(listing.price) * 100), // Stripe expects cents
            product_data: {
              name: listing.title,
              description: listing.description,
              images: [
                `https://westerncloset1.s3.amazonaws.com/${listing.image_key}`,
              ],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?listingId=${listing.id}`,
      cancel_url: `${process.env.CLIENT_URL}/listings/${listing.id}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe session creation failed:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
