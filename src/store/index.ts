import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./companies/slice";
import usersReducer from "./users/slice";

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;