import { createSlice } from '@reduxjs/toolkit';

const messageSentSlice = createSlice({
  name: 'messageSent',
  initialState: false,
  reducers: {
    setMessageSent: (state, { payload }) => {
      return (state = payload);
    },
  },
});

export const { setMessageSent } = messageSentSlice.actions;

export default messageSentSlice.reducer;
