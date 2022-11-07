import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { User } from '../../utils/types';
import { Events } from '../types';
import { getSocket } from '../services/socket';
import axios from 'axios';

type AuthState = {
  user: User | null;
  isAuth: boolean;
};

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = JSON.parse(
    JSON.stringify(sessionStorage.getItem('access_token') as string)
  );
  const response = await axios.get(`http://localhost:3001/auth/profile`, {
    headers: {
      Authorization: 'Bearer ' + token, //the token is a variable which holds the token
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuth: false } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, access_token },
      }: PayloadAction<{ user: User | null; access_token: string | null }>
    ) => {
      state.user = user;
      state.isAuth = true;
      let socket;

      if (access_token) {
        socket = getSocket(`Bearer ${access_token}`);

        sessionStorage.setItem('access_token', access_token);

        socket.connect();
        socket.emit(Events.LOGIN_NEW_PARTICIPANT);
      }
    },
    logout: (state) => {
      sessionStorage.removeItem('access_token');
      state.user = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state, action) => {})
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;

        const token = JSON.parse(
          JSON.stringify(sessionStorage.getItem('access_token'))
        );

        const socket = getSocket(`Bearer ${token}`);

        socket.emit(Events.LOGIN_NEW_PARTICIPANT);
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuth = false;
        state.user = {} as User;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
