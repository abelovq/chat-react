import React, { FC } from 'react';
import { useGetNewUsersQuery } from '../../store/services/users';
import { useTypedSelector } from '../../store/types';
import { Aside } from '../../styled.components';
import { Friend, User } from '../../utils/types';
import { ChatUsersList } from '../users';

type Props = {
  friends: Friend[] | undefined;
};

export const AsideRight: FC<Props> = ({ friends }) => {
  const { user, isAuth } = useTypedSelector((state) => state.auth);

  const { data: users, isLoading } = useGetNewUsersQuery(undefined, {
    skip: !isAuth,
  });

  return (
    <Aside position='right'>
      <h1 style={{ marginBottom: 10 }}>Participants</h1>
      <ChatUsersList
        type='users'
        users={users as User[]}
        friends={friends}
        user={user!}
      />
    </Aside>
  );
};
