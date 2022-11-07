import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { LoginCreds, User } from '../../utils/types';
import { logout } from '../slices/auth.slice';
import { Events } from '../types';
import { socket } from './socket';

export const myQuery = (path: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3001/${path}`,
    prepareHeaders: (headers, { getState }) => {
      const token = JSON.parse(
        JSON.stringify(sessionStorage.getItem('access_token') as string)
      );
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
  const baseQueryWithLogout: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      socket.emit(Events.LOGOUT);
      api.dispatch(logout());
    }
    return result;
  };
  return baseQueryWithLogout;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: myQuery('auth'),

  tagTypes: ['Friend'],

  endpoints: (build) => ({
    login: build.mutation<{ user: User; access_token: string }, LoginCreds>({
      query(body) {
        return {
          url: `login`,
          method: 'POST',
          body,
        };
      },
    }),
    logout: build.mutation<{}, void>({
      queryFn: () => {
        return new Promise((resolve) => {
          socket.emit(Events.LOGOUT, () => {
            resolve({ data: 'true' });
          });
        });
      },
      invalidatesTags: ['Friend'],
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        await cacheDataLoaded;
        try {
          socket.close();
        } catch (err) {}
        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
