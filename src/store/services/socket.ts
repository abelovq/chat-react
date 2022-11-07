import { io, Socket } from 'socket.io-client';
export let socket: Socket;

export function getSocket(token: string) {
  if (socket) {
    socket.io.opts.extraHeaders!.Authorization = token;
  }
  if (!socket) {
    socket = io('http://localhost:3001', {
      withCredentials: true,
      extraHeaders: {
        Authorization: token,
      },
    });
  }
  return socket;
}
