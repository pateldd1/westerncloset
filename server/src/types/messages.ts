export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  listing_id: number;
  content: string;
  created_at: string;
}

export interface SellerThread {
  listing_id: number;
  buyer_id: number;
  buyer_username: string;
  listing_title: string;
  last_message_time: string;
  last_message: string;
}

export interface BuyerThread {
  listing_id: number;
  seller_id: number;
  seller_username: string;
  listing_title: string;
  last_message_time: string;
  last_message: string;
}
