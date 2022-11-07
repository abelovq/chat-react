import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

export enum Events {
  LOGIN_NEW_PARTICIPANT = 'LOGIN_NEW_PARTICIPANT',
  JOIN_NEW_PARTICIPANT = 'JOIN_NEW_PARTICIPANT',
  JOIN_NEW_PARTICIPANTS = 'JOIN_NEW_PARTICIPANTS',
  LOGOUT = 'LOGOUT',
  RECONNECT = 'RECONNECT',
  RECEIVE_PRIVATE_MESSAGE = 'RECEIVE_PRIVATE_MESSAGE',
  SEND_PRIVATE_MESSAGE = 'SEND_PRIVATE_MESSAGE',
  SEND_PRIVATE_MESSAGES = 'SEND_PRIVATE_MESSAGES',
  TYPING = 'TYPING',
  STOP_TYPING = 'STOP_TYPING',
  WHO_TYPING = 'WHO_TYPING',
  READ_MESSAGE = 'READ_MESSAGE',
  READ_MESSAGE_DONE = 'READ_MESSAGE_DONE',
  EDIT_MESSAGE = 'EDIT_MESSAGE',
  EDIT_MESSAGE_DONE = 'EDIT_MESSAGE_DONE',
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
