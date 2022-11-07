import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';
import { Message } from '../../utils/types';
import { socket } from '../services/socket';
import { Events } from '../types';

type setMessageIsReadType = {
  senderId: number;
  messageId: number;
  status: boolean;
};

export const setMessageReadStatus = createAsyncThunk(
  'messages/makesRead',
  async ({ messageId, status }: setMessageIsReadType, thunkAPI) => {
    const token = JSON.parse(
      JSON.stringify(sessionStorage.getItem('access_token') as string)
    );
    const response = await axios.post(
      `http://localhost:3001/messages/${messageId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token, //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  }
);

type initialStateType = {
  editOpen: boolean;
  editingMessage: Message | null;
};

const initialState: initialStateType = {
  editOpen: false,
  editingMessage: null,
};

const messagesSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setEdit: (state, { payload, type }: { payload: Message; type: any }) => {
      state.editOpen = !state.editOpen;
      state.editingMessage = payload;
    },
    cancelEdit: (state) => {
      return (state = initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMessageReadStatus.fulfilled, (state, action) => {
      socket.emit(Events.READ_MESSAGE, {
        senderId: action.meta.arg.senderId,
        messageId: action.meta.arg.messageId,
      });
    });
  },
});

export const selectEditOpen = (state: RootState) => state.messages.editOpen;
export const selectEditEditingMessage = (state: RootState) =>
  state.messages.editingMessage;

export const { setEdit, cancelEdit } = messagesSlice.actions;

export default messagesSlice.reducer;
