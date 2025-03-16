// This slice handles all authentication data

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

// Type for the user
interface User {
  name: string;
  email: string;
  picture: string;
}
// User Logged In or Out
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;  
}
// Initial Auth State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      redirect('/')
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
