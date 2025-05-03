import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  token: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  username: "",
  token: localStorage.getItem("token") || "",
  loading: false,
  error: null,
};

// Async thunk: login
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      const { token } = data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.username;

      localStorage.setItem("token", token);

      return { username, token };
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown login error");
    }
  }
);

// ✅ Async thunk: signup
export const signupUser = createAsyncThunk(
  "user/signup",
  async (
    credentials: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      const { token } = data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.username;

      localStorage.setItem("token", token);

      return { username, token };
    } catch (err: any) {
      return rejectWithValue(err.message || "Unknown signup error");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = "";
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Add signupUser cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
