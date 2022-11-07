import { combineReducers } from 'redux';

const messages = (
  state = { messages: [], currUser: null, users: [], typing: [], canvas: [] },
  action
) => {
  console.log('action.type', action);
  switch (action.type) {
    case 'message/receive': {
      const { payload } = action;
      return { ...state, messages: state.messages.concat(payload) };
    }
    case 'added new user/all': {
      console.log('REDUCEr', action.payload);
      const { users, ...user } = action.payload;
      // const { payload } = action;
      // return { ...state, messages: state.messages.concat(payload) };
      return { ...state, users };
    }
    case 'added new user/one': {
      console.log('REDUCEr', action.payload);
      // const { payload } = action;
      // return { ...state, messages: state.messages.concat(payload) };

      return { ...state, currUser: action.payload };
    }
    case 'is typing': {
      const whoIsTyping = [];
      if (!whoIsTyping.includes(action.payload))
        whoIsTyping.push(action.payload);
      return { ...state, typing: whoIsTyping };
    }
    case 'stoped typing': {
      return {
        ...state,
        typing: state.typing.filter((el) => el !== action.payload),
      };
    }
    case 'messages/get': {
      console.log('first', action.payload);
      return {
        ...state,
        currUser: {
          ...state.currUser,
          conversationId: action.payload.conversationId,
        },
        messages: action.payload.messages,
      };
    }
    case 'get users': {
      return { ...state, users: action.payload };
    }
    case 'drew': {
      console.log('action.drew', action.payload);
      return {
        ...state,
        canvas: [
          ...state.canvas,
          action.payload.from.x,
          action.payload.from.y,
          action.payload.to.x,
          action.payload.to.y,
        ],
      };
    }
    case 'set receiver': {
      return {
        ...state,
        currUser: { ...state.currUser, receiveUserId: action.payload },
      };
    }
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  messages,
});
