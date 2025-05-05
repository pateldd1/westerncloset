import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Listing } from "../../types/listings";

interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  selectedListing: null,
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000";

// ✅ 1. Fetch user's listings
export const fetchUserListings = createAsyncThunk(
  "listings/fetchUserListings",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/listings/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch listings");

      return data.listings;
    } catch (err: any) {
      return rejectWithValue(err.message || "Fetch failed");
    }
  }
);

export const createListing = createAsyncThunk(
  "listings/createListing",
  async (formData: FormData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create listing");

      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Fetch failed");
    }
  }
);

// ✅ 2. Delete a listing
export const deleteUserListing = createAsyncThunk(
  "listings/deleteUserListing",
  async (id: number, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      return id; // return ID so we can remove from state
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

export const updateUserListing = createAsyncThunk(
  "listings/updateUserListing",
  async (
    { id, updates }: { id: number; updates: Partial<Listing> },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      return data.listing;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

export const fetchListingById = createAsyncThunk(
  "listings/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Listing not found");

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error loading listing");
    }
  }
);

// 🧠 (Optional) 3. Update a listing — can be added later

// ✅ Create the slice
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch listings
      .addCase(fetchUserListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchUserListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete listing
      .addCase(deleteUserListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = state.listings.filter((l) => l.id !== action.payload);
      })
      .addCase(deleteUserListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserListing.fulfilled, (state, action) => {
        const index = state.listings.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
      })
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedListing = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default listingsSlice.reducer;
