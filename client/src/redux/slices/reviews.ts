import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Review } from "../../types/review";

interface ReviewsState {
  reviews: Review[];
  average: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  average: null,
  loading: false,
  error: null,
};

export const fetchReviewsBySeller = createAsyncThunk(
  "reviews/fetchBySeller",
  async (sellerId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${sellerId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch reviews");

      return { reviews: data.reviews, average: data.average };
    } catch (err: any) {
      return rejectWithValue(err.message || "Fetch failed");
    }
  }
);

export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (
    {
      sellerId,
      rating,
      comment,
    }: { sellerId: number; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      return data.review;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.average = action.payload.average;
      })
      .addCase(fetchReviewsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewsSlice.reducer;
