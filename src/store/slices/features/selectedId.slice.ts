import { createSlice } from '@reduxjs/toolkit';

const selectedIdSlice = createSlice({
  name: 'selectedId',
  initialState: null,

  reducers: {
    setSelectedId: (state, { payload }) => {
      return (state = payload);
    },
  },
});

export const { setSelectedId } = selectedIdSlice.actions;

export default selectedIdSlice.reducer;
