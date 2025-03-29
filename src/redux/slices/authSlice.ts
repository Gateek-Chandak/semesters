// This slice handles all authentication data

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

// Type for the user
interface User {
  id: number,
  googleId: number,
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
    login(state, action: PayloadAction<{ user: any, user_id: any}>) {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.user_id,
        googleId: action.payload.user.id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        picture: action.payload.user.picture
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      redirect('/')
    }
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
