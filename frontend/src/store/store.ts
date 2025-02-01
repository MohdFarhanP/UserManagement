import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Redux Persist Configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // Only persist the auth state
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Ignore serialization warnings
        }),
});

// Create persistor
export const persistor = persistStore(store);

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
