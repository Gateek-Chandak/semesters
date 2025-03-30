// This slice handles all authentication data

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      const { user, user_id } = action.payload;
      state.isAuthenticated = true;
      state.user = {
        id: user_id,
        googleId: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
