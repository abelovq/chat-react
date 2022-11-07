import { createSlice } from '@reduxjs/toolkit';

const firstRenderSlice = createSlice({
  name: 'firstRender',
  initialState: {
    firstRender: true,
    scrolling: false,
  },

  reducers: {
    setFirstRender: (state, { payload }) => {
      state.firstRender = payload;
    },
  },
});

export const { setFirstRender } = firstRenderSlice.actions;

export default firstRenderSlice.reducer;
