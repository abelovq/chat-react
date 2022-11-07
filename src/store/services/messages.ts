import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  EditMessageContent,
  Message,
  MessageContent,
} from '../../utils/types';
import { Events } from '../types';
import { getSocket, socket } from './socket';
import { RootState } from '../index';
import { setMessageSent } from '../slices/features/hasMessageSent.slice';
import { setMessageReadStatus } from '../slices/messages.slice';
import { myQuery } from './auth';
import { logout } from '../slices/auth.slice';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: myQuery('messages'),
  tagTypes: ['Message', 'Friend'],

  endpoints: (build) => ({
    // variant of progressive loading content - some lags if a lot of elements in the DOM

    // getConversationMessages: build.query<
    //   Message[] | { messages: Message[]; totalPages: number },
    //   { page: number; receiverId: number; senderId: number } | undefined
    // >({
    //   query: (arg: { page: number; receiverId: number; senderId: number }) => {
    //     // debugger;
    //     return `conversations/find?receiverId=${arg.receiverId}&senderId=${arg.senderId}&page=${arg.page}`;
    //   },
    // }),

    getConversationStreamMessages: build.query<
      Message[],
      { receiverId: number; senderId: number }
    >({
      query: (arg: { receiverId: number; senderId: number }) => {
        return `conversations/find?receiverId=${arg.receiverId}&senderId=${arg.senderId}`;
      },

      async onCacheEntryAdded(
        arg,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          getState,
          dispatch,
        }
      ) {
        const token = JSON.parse(
          JSON.stringify(sessionStorage.getItem('access_token') as string)
        );
        const socket = getSocket(`Bearer ${token}`);
        try {
          await cacheDataLoaded;

          socket.on(Events.RECEIVE_PRIVATE_MESSAGE, (data: Message) => {
            const { selectedId } = getState() as RootState;
            const { id, user } = data;

            updateCachedData((draft) => {
              if (selectedId === user.id) {
                dispatch(setMessageSent(true));

                dispatch(
                  setMessageReadStatus({
                    senderId: selectedId,
                    messageId: id,
                    status: true,
                  })
                );

                draft.push(data);
              }
            });
          });

          socket.on(Events.READ_MESSAGE_DONE, (data: Message[]) => {
            updateCachedData((draft) => {
              data.forEach((item) => {
                const idx = draft.findIndex((i) => i.id === item.id);
                if (idx) {
                  const el = draft[idx];
                  el.isRead = true;
                }
              });
            });
          });

          socket.on(Events.EDIT_MESSAGE_DONE, (updatedPost) => {
            updateCachedData((draft) => {
              draft.splice(
                draft.findIndex((el) => el.id === updatedPost.id),
                1,
                updatedPost
              );
            });
          });
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    sendMessage: build.mutation<Message, MessageContent>({
      queryFn: (messageContent: MessageContent) => {
        return new Promise((resolve) => {
          socket.emit(
            Events.SEND_PRIVATE_MESSAGE,
            messageContent,
            (message: Message) => {
              resolve({ data: message });
            }
          );
        });
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPost } = await queryFulfilled;
          const patchResult = dispatch(
            messagesApi.util.updateQueryData(
              'getConversationStreamMessages',
              { senderId: data.senderId, receiverId: data.receiverId },
              (draft) => {
                draft.push(updatedPost);
              }
            )
          );
        } catch {}
      },
    }),

    editMessage: build.mutation<Message, EditMessageContent>({
      queryFn: (messageContent: EditMessageContent) => {
        return new Promise((resolve) => {
          socket.emit(
            Events.EDIT_MESSAGE,
            messageContent,
            (message: Message) => {
              resolve({ data: message });
            }
          );
        });
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPost } = await queryFulfilled;
          const patchResult = dispatch(
            messagesApi.util.updateQueryData(
              'getConversationStreamMessages',
              { senderId: data.senderId, receiverId: data.receiverId },
              (draft) => {
                draft.splice(
                  draft.findIndex((el) => el.id === updatedPost.id),
                  1,
                  updatedPost
                );
              }
            )
          );
        } catch {}
      },
    }),

    getNotReadMessages: build.query<
      Record<number, Message[]>,
      { senderId: number }
    >({
      query: (arg: { senderId: number }) => `notread?senderId=${arg.senderId}`,

      async onCacheEntryAdded(
        arg,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          getState,
          dispatch,
        }
      ) {
        try {
          await cacheDataLoaded;

          socket.on(Events.RECEIVE_PRIVATE_MESSAGE, (data: Message) => {
            const { selectedId } = getState() as RootState;
            try {
              if (selectedId !== data.user.id) {
                updateCachedData((draft) => {
                  if (draft[data.user.id]) {
                    draft[data.user.id] = [
                      ...(draft[data.user.id] as Message[]),
                      data,
                    ];
                  } else {
                    draft[data.user.id] = [data];
                  }
                });
              }
            } catch {}
          });
        } catch {}

        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetConversationStreamMessagesQuery,
  useGetNotReadMessagesQuery,
  useEditMessageMutation,
} = messagesApi;
