import db from "../db/knex";
import { Message, SellerThread, BuyerThread } from "../types/messages";

const MessageService = {
  async send({
    sender_id,
    receiver_id,
    listing_id,
    content,
  }: Partial<Message>): Promise<Message> {
    const [message] = await db("messages")
      .insert({ sender_id, receiver_id, listing_id, content })
      .returning("*");
    return message;
  },

  async getMessagesForListing(
    listing_id: number,
    user_id: number
  ): Promise<Message[]> {
    return db("messages")
      .where("listing_id", listing_id)
      .andWhere((builder) =>
        builder.where("sender_id", user_id).orWhere("receiver_id", user_id)
      )
      .orderBy("created_at", "asc");
  },

  async getSellerInbox(sellerId: number): Promise<SellerThread[]> {
    const threads = await db("messages")
      .join("listings", "messages.listing_id", "listings.id")
      .join("users as buyers", "messages.sender_id", "buyers.id")
      .where("listings.seller_id", sellerId)
      .whereNot("messages.sender_id", sellerId) // Only buyer messages
      .select(
        "messages.listing_id",
        "messages.sender_id as buyer_id",
        "buyers.username as buyer_username",
        "listings.title as listing_title",
        db.raw("MAX(messages.created_at) as last_message_time"),
        db.raw("MAX(messages.content) as last_message")
      )
      .groupBy(
        "messages.listing_id",
        "messages.sender_id",
        "buyers.username",
        "listings.title"
      )
      .orderBy("last_message_time", "desc");

    return threads;
  },
  async getBuyerInbox(buyerId: number): Promise<BuyerThread[]> {
    const threads = await db("messages")
      .join("listings", "messages.listing_id", "listings.id")
      .join("users as sellers", "listings.seller_id", "sellers.id")
      .where("messages.sender_id", buyerId)
      .whereNot("messages.receiver_id", buyerId) // Only seller messages
      .whereNot("listings.seller_id", buyerId) // Exclude messages sent by the buyer
      .select(
        "messages.listing_id",
        "messages.receiver_id as seller_id",
        "sellers.username as seller_username",
        "listings.title as listing_title",
        db.raw("MAX(messages.created_at) as last_message_time"),
        db.raw("MAX(messages.content) as last_message")
      )
      .groupBy(
        "messages.listing_id",
        "messages.receiver_id",
        "sellers.username",
        "listings.title"
      )
      .orderBy("last_message_time", "desc");

    return threads;
  },
};

export default MessageService;
