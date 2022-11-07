import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { ChatUserItem } from '.';
import { ListItemType } from '../../../contextMenu/contextMenu';
import { FriendListItemTypes } from '../../../contextMenu/friendContextMenu';
import UserContextMenu from '../../../contextMenu/userContextMenu';

import { useTypedSelector } from '../../../store/types';
import { Friend, Message, Status } from '../../../utils/types';
import { VisibleType } from '../list';
import NotReadMessages from './notReadMessages';

import './styles.scss';

type Props = {
  id: number;
  name?: string;
  status: Status;
  lastMessage?: Message;
  setVisible: (value: VisibleType) => void;
  onClick: (id: number) => void;
  withContextMenu: boolean;
  visible: VisibleType;
  onRemoveFriend: (id: number) => void;
  onAddFriend: (id: number) => void;
  onClickOutside: () => void;
  friends: Friend[];
  notReadMessages: Message[];
};

export const ChatUser: FC<Props> = ({
  id,
  setVisible,
  name,
  status,
  onClick,
  notReadMessages,
  withContextMenu,
  onClickOutside,
  onRemoveFriend,
  onAddFriend,
  visible,
  friends,
}) => {
  const selectedId = useTypedSelector((state) => state.selectedId);

  const handleContextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible({ id, pos: { left: e.pageX, top: e.pageY } });
  };

  const handleClick = (id: number) => {
    onClick(id);
  };

  const isHeMyFriend = useMemo(() => {
    return friends?.some((f) => f.id === id);
  }, [id, friends]);

  const userContextMenuList: ListItemType<FriendListItemTypes>[] = isHeMyFriend
    ? [
        { text: 'Open conversation', type: 'open' },
        {
          text: 'Remove from friends',
          type: 'remove',
        },
      ]
    : [
        { text: 'Open conversation', type: 'open' },
        { text: 'Add to Friends', type: 'add' },
      ];

  return (
    <>
      <ChatUserItem
        name={name}
        id={id}
        status={status}
        onContextClick={handleContextClick}
        onClick={handleClick}
        notReadMessagesComp={
          selectedId !== id ? (
            <NotReadMessages id={id} notReadMessages={notReadMessages} />
          ) : null
        }
      />
      {withContextMenu && (
        <UserContextMenu
          list={userContextMenuList}
          onOpenConversation={handleClick}
          onClickOutside={onClickOutside}
          onAddToFriends={onAddFriend}
          onRemoveFromFriends={onRemoveFriend}
          userId={id}
          visible={visible?.id === id}
          pos={visible?.pos}
        />
      )}
    </>
  );
};
