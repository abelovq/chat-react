import React, { FC } from 'react';
import { useTypedSelector } from '../../store/types';
import { Aside } from '../../styled.components';
import { Friend } from '../../utils/types';
import { ChatUsersList } from '../users';

type Props = {
  friends: Friend[] | undefined;
};

export const AsideLeft: FC<Props> = ({ friends }) => {
  const { user } = useTypedSelector((state) => state.auth);

  return (
    <Aside position='left'>
      <h1 style={{ marginBottom: 10 }}>Contacts</h1>
      <ChatUsersList type='friends' users={friends as Friend[]} user={user!} />
    </Aside>
  );
};
