export interface Review {
  id: number;
  reviewer_id: number;
  seller_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_username?: string;
  seller_username?: string;
  seller_email?: string;
}
