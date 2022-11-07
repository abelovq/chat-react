export const handleMessage = (message) => {
  console.log('message', message);
  const { userId, msg } = message;
  return {
    type: 'message/receive',
    payload: { userId, msg },
  };
};

export const handleAllLogin = (name) => {
  console.log('name', name);
  return {
    payload: name,
    type: 'added new user/all',
  };
};

export const handleLoginUser = (user) => {
  return {
    payload: user,
    type: 'added new user/one',
  };
};

export const handleTyping = (name) => {
  return {
    payload: name,
    type: 'is typing',
  };
};

export const handleStopTyping = (name) => {
  console.log('handleStopTyping');
  return {
    payload: name,
    type: 'stoped typing',
  };
};

export const handleUsers = (users) => ({
  payload: users,
  type: 'get users',
});

export const handleGetConversationMessages = (data) => {
  console.log('handleGetConversationMessages', data);
  return {
    payload: data,
    type: 'messages/get',
  };
};

export const handleDraw = (data) => {
  console.log('data', data);
  return {
    payload: data,
    type: 'drew',
  };
};
