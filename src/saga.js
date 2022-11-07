import {
  put,
  take,
  all,
  fork,
  takeEvery,
  delay,
  apply,
  call,
  cancel,
  spawn,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { io } from 'socket.io-client';
import {
  handleAllLogin,
  handleMessage,
  handleLoginUser,
  handleTyping,
  handleUsers,
  handleGetConversationMessages,
  handleDraw,
  handleStopTyping,
} from './actions';

const createWebSocketConnection = () => {
  const socket = io('http://localhost:3005');
  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(socket) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel((emit) => {
    // const messagehandler = (event) => {
    //   console.log('event.payload', event);
    //   emit(handleMessage(event));
    // };

    const loginAllHandler = (event) => {
      emit(handleAllLogin(event));
    };

    const loginUserHandler = (event) => {
      emit(handleLoginUser(event));
    };

    const handleUserConnect = (event) => {
      emit(handleMessage(event));
    };

    const errorHandler = (errorEvent) => {
      emit(new Error(errorEvent.reason));
    };

    const typingHandler = (event) => {
      emit(handleTyping(event));
    };

    const usersHandler = (event) => {
      emit(handleUsers(event));
    };

    const getChatMessagesHandler = (event) => {
      emit(handleGetConversationMessages(event));
    };

    const drawHandler = (event) => {
      emit(handleDraw(event));
    };

    const stopTypingHandler = (event) => {
      emit(handleStopTyping(event));
    };

    // setup the subscription
    socket.on('users', usersHandler);
    // socket.on('message', messagehandler);
    socket.on('error', errorHandler);
    socket.on('add new user/all', loginAllHandler);
    socket.on('add new user/one', loginUserHandler);
    socket.on('new user connected', handleUserConnect);
    socket.on('is typing', typingHandler);
    socket.on('stoped typing', stopTypingHandler);

    socket.on('get conversation messages', getChatMessagesHandler);
    socket.on('drew', drawHandler);
    socket.on('dis', loginAllHandler);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method

    return () => {};
  });
}

// function* read(socket) {
//   const channel = yield call(createWebSocketConnection, socket);
//   while (true) {
//     let action = yield take(channel);
//     yield put(action);
//   }
// }

// function* write(socket, message) {
//   yield apply(socket, socket.emit, message); // call `emit` as a method with `socket` as context
// }

function* read(socket) {
  const channel = yield call(createSocketChannel, socket);
  while (true) {
    let action = yield take(channel);
    console.log('action', action);
    yield put(action);
  }
}

function* write(socket) {
  while (true) {
    const {
      payload: { msg, sendUserId, receiveUserId, conversationId },
    } = yield take(`message/send`);
    socket.emit('message/send', {
      msg,
      sendUserId,
      receiveUserId,
      conversationId,
    });
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* createConversation(socket) {
  while (true) {
    const { payload } = yield take('conversation/create');
    console.log('connectToRoom', payload);
    socket.emit('conversation/create', payload);
  }
}

function* draw(socket) {
  while (true) {
    const { payload } = yield take('draw');
    socket.emit('draw', payload);
  }
}

function* typing(socket) {
  while (true) {
    const {
      payload: { name, conversationId },
    } = yield take('typing');
    console.log('typing', name);
    socket.emit('typing', { name, conversationId });
    const {
      payload: { name: n, conversationId: r },
    } = yield take('stop typing');

    socket.emit('stop typing', { n, r });
  }
}

function* login(socket) {
  while (true) {
    const { payload } = yield take(`login`);
    socket.emit('login', payload);
  }
}

export function* watchOnPings() {
  // const socket = yield call(createWebSocketConnection);
  // const socketChannel = yield call(createSocketChannel, socket);
  const socket = yield call(createWebSocketConnection);
  while (true) {
    try {
      const { payload } = yield take(`login`);
      socket.emit('login', payload);
      // yield fork(login, socket);
      const task = yield fork(handleIO, socket);
      // // console.log('data', data);

      // const { payload: message } = yield take('message/send');

      // socket.emit('message/send', { message });

      // const data = yield take(socketChannel);
      // console.log('data', data);
      // yield fork(write, socket, data.message);
      // yield put({ type: 'message/receive', payload: data });
      // // const payload = yield take(socketChannel);
      // // console.log('payload', payload);
      // // yield put(payload);
      // yield fork(write, socket);
      yield fork(createConversation, socket);
      yield fork(draw, socket);

      yield fork(typing, socket);
    } catch (err) {
      console.error('socket error:', err);
      // socketChannel is still open in catch block
      // if we want end the socketChannel, we need close it explicitly
      // socketChannel.close()
    }
  }
}

const rootSaga = function* () {
  yield all([fork(watchOnPings)]);
};

export default rootSaga;
