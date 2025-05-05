import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types";

interface MessageState {
  thread: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  thread: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (listingId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${listingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/send",
  async (
    { listingId, content }: { listingId: number; content: string },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listing_id: listingId, content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.thread.push(action.payload);
      });
  },
});

export default messageSlice.reducer;
