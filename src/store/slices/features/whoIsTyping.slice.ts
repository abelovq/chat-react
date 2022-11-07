import { createSlice } from '@reduxjs/toolkit';

type WhoIsTypingInChat = {
  [prop: string]: { state: boolean; name: string | null } | null;
};

type TypingPayload = { payload: { id: number; name: string | null } };

const whoIsTypingSlice = createSlice({
  name: 'whoIsTyping',
  initialState: {
    whoIsTypingInChat: {} as WhoIsTypingInChat,
  },
  reducers: {
    setWhoIsTypingInChat: (state, { payload }: TypingPayload) => {
      const { id, name } = payload;
      if (!state.whoIsTypingInChat[id]) {
        state.whoIsTypingInChat[id] = { state: true, name };
      }
    },

    setStopTypingInChat: (state, { payload }: TypingPayload) => {
      const { id, name } = payload;

      state.whoIsTypingInChat[id] = { state: false, name };
      state.whoIsTypingInChat[id] = null;
    },
  },
});

export const { setWhoIsTypingInChat, setStopTypingInChat } =
  whoIsTypingSlice.actions;

export default whoIsTypingSlice.reducer;
