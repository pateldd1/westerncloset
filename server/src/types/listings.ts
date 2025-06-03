export interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  image_key: string;
  seller_id?: number;
  seller_username?: string;
  seller_email?: string;
  buyer_id?: number;
  buyer_username?: string;
  buyer_email?: string;
}

export interface ListingQueryParams {
  search?: string;
  category?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "oldest";
  minPrice?: string;
  maxPrice?: string;
}
