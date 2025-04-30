import { Request, Response } from "express";
import db from "../db/knex";
import s3 from "../services/s3";
import ListingService from "../services/listings";
import { Listing } from "../types/listings"; // Adjust the import path as necessary

export const createListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, category } = req.body;
    const file = req.file;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!title || !description || !price || !category || !file) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const s3Key = `${req.user.id}/${Date.now()}-${file.originalname}`;
    // Upload the file to Amazon S3
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: s3Key,
      Body: file.buffer, // Read the file from the local path
    };

    const s3Response = await s3.upload(s3Params).promise();
    const listing: Listing = await ListingService.create({
      title,
      description,
      price,
      category,
      image_key: s3Response.Key,
      seller_id: req.user.id,
    });

    res.status(201).json({
      message: "Listing created successfully",
      data: listing,
    });
  } catch (err) {
    console.error("❌ Failed to create listing:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Query the listings from the database
    const listings: Listing[] = await ListingService.findAll(); // Replace 'listings' with your actual table name
    res.json(listings); // Send the listings as a JSON response
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

export const getUserListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user.id;

    const listings: Listing[] = await ListingService.findByUserId(userId);
    res.status(200).json({ listings });
  } catch (err) {
    console.error("❌ Failed to fetch user listings:", err);
    res.status(500).json({ error: "Failed to fetch user listings" });
  }
};

export const deleteListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user.id;
    const listingId = parseInt(req.params.id);

    if (isNaN(listingId)) {
      res.status(400).json({ error: "Invalid listing ID" });
      return;
    }

    // Check if the listing exists and belongs to the user
    const listing = await db("listings").where({ id: listingId }).first();

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (listing.seller_id !== userId) {
      res
        .status(403)
        .json({ error: "You do not have permission to delete this listing" });
      return;
    }

    // Proceed to delete
    await ListingService.delete(listingId);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete listing:", err);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

export const updateListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const listingId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { title, description, price, category } = req.body;

    if (isNaN(listingId)) {
      res.status(400).json({ error: "Invalid listing ID" });
      return;
    }

    // Ensure the listing exists and is owned by the user
    const listing: Listing | undefined = await ListingService.findById(
      listingId
    );

    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (listing.seller_id !== userId) {
      res.status(403).json({ error: "Unauthorized: not your listing" });
      return;
    }

    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
      ...(category && { category }),
    };

    const [updatedListing] = await db("listings")
      .where({ id: listingId })
      .update(updatedFields)
      .returning("*");

    res
      .status(200)
      .json({ message: "Listing updated", listing: updatedListing });
  } catch (err) {
    console.error("❌ Error updating listing:", err);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

export const getListingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const listing: Listing | undefined = await ListingService.findById(
      parseInt(id)
    );

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    res.json(listing);
  } catch (err) {
    console.error("❌ Error fetching listing by ID:", err);
    res.status(500).json({ message: "Failed to retrieve listing" });
  }
};
