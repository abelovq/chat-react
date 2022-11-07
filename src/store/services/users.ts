import { current } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';

import type { Friend, User } from '../../utils/types';
import { logout } from '../slices/auth.slice';

import {
  setStopTypingInChat,
  setWhoIsTypingInChat,
} from '../slices/features/whoIsTyping.slice';
import { Events } from '../types';
import { myQuery } from './auth';
import { socket } from './socket';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: myQuery(''),
  tagTypes: ['User', 'Friend'],
  endpoints: (build) => ({
    getNewUsers: build.query<User[], void>({
      query: () => 'users/online',

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

          socket.on('exception', () => {
            //TODO handle
            console.log('exception');
            socket.emit(Events.LOGOUT);
            dispatch(logout());
            socket.close();
          });

          // TODO
          socket.on('disconnect', (reason) => {
            console.log('disconnect reason', reason);
            // if (reason === 'io client disconnect') {
            //   socket.connect();
            // } else if (reason === 'transport close') {
            //   console.log('else');
            //   socket.connect();
            // }
          });

          socket.on('connect', () => {
            console.log('connect');
          });

          socket.on('connect_error', (error) => {
            console.log('connect_error', error);
            setTimeout(() => {
              socket.connect();
            }, 1000);
          });

          socket.on('connect_failed', (err) => {
            console.log('err connect_failed', err);
          });

          socket.io.on('reconnect', (attempt) => {
            console.log('reconnect', attempt);
          });

          socket.on(Events.JOIN_NEW_PARTICIPANT, (data: User) => {
            updateCachedData((draft) => {
              draft.splice(
                draft.findIndex((el) => el.id === data.id),
                1,
                data
              );
            });
          });

          socket.on(Events.LOGOUT, (data: User) => {
            const {
              auth: { user },
            } = getState() as RootState;

            updateCachedData((draft) => {
              draft.splice(
                draft.findIndex((el) => el.id === data.id),
                1,
                data
              );
            });
          });

          // TODO
          socket.on(Events.RECONNECT, (data: User[]) => {
            updateCachedData((draft) => {
              draft.splice(0, draft.length, ...data);
            });
          });

          socket.on(Events.WHO_TYPING, ({ name, id }) => {
            dispatch(setWhoIsTypingInChat({ id, name }));
          });

          socket.on(Events.STOP_TYPING, ({ name, id }) => {
            dispatch(setStopTypingInChat({ id, name }));
          });
        } catch {}

        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getFriends: build.query<Friend[], void>({
      query: () => 'friends',
      providesTags: (result, error, arg) => {
        return result
          ? [
              ...result.map(({ id }) => ({ type: 'Friend' as const, id })),
              'Friend',
            ]
          : ['Friend'];
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
        try {
          await cacheDataLoaded;

          socket.on(Events.JOIN_NEW_PARTICIPANT, (data: User) => {
            const {
              auth: { user },
            } = getState() as RootState;

            updateCachedData((draft) => {
              if (user?.friends.includes(data.id)) {
                draft[draft.findIndex((el) => el.id === data.id)].status =
                  data.status;
              }
            });
          });

          socket.on(Events.LOGOUT, (data: User) => {
            const {
              auth: { user },
            } = getState() as RootState;

            try {
              updateCachedData((draft) => {
                const friend =
                  draft[draft.findIndex((el) => el.id === data.id)];
                if (friend) {
                  friend.status = data.status;
                }
              });
            } catch {}
          });
        } catch {}
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    addToFriends: build.mutation<Friend, { id: number }>({
      query(body) {
        return {
          url: `friends/add`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Friend'],
    }),
    removeFromFriends: build.mutation<Friend, { id: number }>({
      query(body) {
        return {
          url: `friends/remove`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Friend'],
    }),
  }),
});

export const {
  useGetNewUsersQuery,
  useGetFriendsQuery,
  useAddToFriendsMutation,
  useRemoveFromFriendsMutation,
} = usersApi;
