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

export const fetchFilteredListings = createAsyncThunk(
  "homeListings/fetchFiltered",
  async (filters: Record<string, string>, { rejectWithValue }) => {
    const query = new URLSearchParams(filters).toString();
    try {
      const res = await fetch(`http://localhost:5000/api/listings?${query}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch listings");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const homeListingsSlice = createSlice({
  name: "homeListings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchFilteredListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeListingsSlice.reducer;
