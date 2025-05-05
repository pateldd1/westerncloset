import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BuyerThread, SellerThread } from "../../types/messages";

interface InboxState {
  buyerThreads: BuyerThread[];
  sellerThreads: SellerThread[];
  loading: boolean;
  error: string | null;
}

const initialState: InboxState = {
  buyerThreads: [],
  sellerThreads: [],
  loading: false,
  error: null,
};

export const fetchBuyerInbox = createAsyncThunk(
  "inbox/fetchBuyerInbox",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/messages/inbox/buyerInbox",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load buyer inbox");
      return data;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

export const fetchSellerInbox = createAsyncThunk(
  "inbox/fetchSellerInbox",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/messages/inbox/sellerInbox",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load seller inbox");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown error");
    }
  }
);

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Buyer Inbox
      .addCase(fetchBuyerInbox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyerInbox.fulfilled, (state, action) => {
        state.buyerThreads = action.payload;
        state.loading = false;
      })
      .addCase(fetchBuyerInbox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Seller Inbox
      .addCase(fetchSellerInbox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerInbox.fulfilled, (state, action) => {
        state.sellerThreads = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerInbox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default inboxSlice.reducer;
