import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContextMenu } from '../../../hooks';

import { useGetNotReadMessagesQuery } from '../../../store/services/messages';
import { socket } from '../../../store/services/socket';
import {
  useAddToFriendsMutation,
  useRemoveFromFriendsMutation,
} from '../../../store/services/users';

import { setSelectedId } from '../../../store/slices/features/selectedId.slice';

import { Events, useAppDispatch, useTypedSelector } from '../../../store/types';

import { ChatUserItemWrapper } from '../../../styled.components';
import { Friend, User } from '../../../utils/types';

import { ChatFriend } from '../item/chatFriend';
import { ChatUser } from '../item/chatUser';

export type VisibleType = {
  id: number | null;
  pos: { left: number; top: number };
};

type Props = {
  users: User[];
  user: User;
  type: 'friends' | 'users';
  friends?: Friend[];
};

export const ChatUsersList: FC<Props> = ({
  type,
  user,
  users = [],
  friends,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();

  const {
    currentData: notReadMessages,
    data: notReadMessagesData,
    isFetching: notReadMessagesFetching,
    refetch,
  } = useGetNotReadMessagesQuery({
    senderId: user?.id as number,
  });

  const selectedId = useTypedSelector((state) => state.selectedId);

  const { visible, onItemClick, onClickOutside } = useContextMenu();

  const [addToFriends] = useAddToFriendsMutation();
  const [removeFromFriends] = useRemoveFromFriendsMutation();

  const handleAddToFriends = (id: number) => {
    addToFriends({ id });
  };

  const handleRemoveFromFriends = (id: number) => {
    removeFromFriends({ id });
  };

  const handleClick = (id: number) => {
    if (id === selectedId && location.pathname !== '/conversations') return;
    dispatch(setSelectedId(+id));

    navigate(`${id}`);
  };

  useEffect(() => {
    dispatch(setSelectedId(+id!));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedId) {
      socket.emit(Events.READ_MESSAGE, {
        senderId: selectedId,
        receiverId: user.id,
      });

      refetch();
    }
  }, [selectedId]);

  const handleClickOutside = () => {
    onClickOutside();
  };

  return (
    <ul className='main-users'>
      {users &&
        users
          .filter((u) => u.email !== user?.email)
          .map((user, i) => (
            <ChatUserItemWrapper
              key={user.id}
              active={id ? user.id === +id : false}
            >
              {type === 'friends' ? (
                <ChatFriend
                  onClick={handleClick}
                  {...user}
                  setVisible={onItemClick}
                  id={user.id}
                  withContextMenu={true}
                  onRemoveFriend={handleRemoveFromFriends}
                  onAddFriend={handleAddToFriends}
                  visible={visible}
                  onClickOutside={handleClickOutside}
                  notReadMessages={
                    notReadMessagesFetching
                      ? []
                      : notReadMessages?.[user.id] || []
                  }
                />
              ) : (
                <ChatUser
                  onClick={handleClick}
                  {...user}
                  friends={friends as Friend[]}
                  setVisible={onItemClick}
                  id={user.id}
                  withContextMenu={true}
                  onRemoveFriend={handleRemoveFromFriends}
                  onAddFriend={handleAddToFriends}
                  visible={visible}
                  onClickOutside={handleClickOutside}
                  notReadMessages={
                    notReadMessagesFetching
                      ? []
                      : notReadMessages?.[user.id] || []
                  }
                />
              )}
            </ChatUserItemWrapper>
          ))}
    </ul>
  );
};
