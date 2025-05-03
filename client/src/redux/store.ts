import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import logger from "redux-logger";

import userReducer from "./slices/userSlice";
import homeListingsReducer from "./slices/homeListings";
import listingsReducer from "./slices/userListings";
import reviewsReducer from "./slices/reviews";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the `user` slice
};

const rootReducer = combineReducers({
  user: userReducer,
  homeListings: homeListingsReducer,
  listings: listingsReducer,
  reviews: reviewsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === "development") {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }).concat(logger);
    }
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    });
  },
});

export const persistor = persistStore(store);

// ✅ Type exports for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
