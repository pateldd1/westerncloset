import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Listing } from "../../types/listings";

interface HomeListingsState {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeListingsState = {
  listings: [],
  loading: false,
  error: null,
};

export const fetchAllListings = createAsyncThunk(
  "homeListings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/listings");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load listings");

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error fetching listings");
    }
  }
);

const homeListingsSlice = createSlice({
  name: "homeListings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeListingsSlice.reducer;
