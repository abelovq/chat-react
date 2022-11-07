import React, { FC, useEffect, useMemo, useState } from 'react';
import { ChatUserItem } from '.';
import { ListItemType } from '../../../contextMenu/contextMenu';
import FriendContextMenu, {
  FriendListItemTypes,
} from '../../../contextMenu/friendContextMenu';
import { useTypedSelector } from '../../../store/types';
import { Message, Status } from '../../../utils/types';
import { VisibleType } from '../list';
import NotReadMessages from './notReadMessages';

import './styles.scss';

type Props = {
  id: number;
  name?: string;
  status: Status;
  lastMessage?: Message;
  setVisible: any;
  onClick: (id: number) => void;
  withContextMenu: boolean;
  onRemoveFriend: (id: number) => void;
  onAddFriend: (id: number) => void;
  visible: VisibleType;
  onClickOutside: () => void;
  notReadMessages: Message[];
};

export const ChatFriend: FC<Props> = ({
  id,
  name,
  status,
  onClick,
  lastMessage,
  withContextMenu,
  onRemoveFriend,
  onAddFriend,
  setVisible,
  visible,
  onClickOutside,
  notReadMessages,
}) => {
  const selectedId = useTypedSelector((state) => state.selectedId);

  const handleContextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible({ id, pos: { left: e.pageX, top: e.pageY } });
  };

  const handleClick = (id: number) => {
    onClick(id);
  };

  const friendContextMenuList: ListItemType<FriendListItemTypes>[] = [
    { text: 'Open conversation', type: 'open' },
    { text: 'Remove from friends', type: 'remove' },
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
        lastMessage={lastMessage}
      />
      {withContextMenu && (
        <FriendContextMenu
          list={friendContextMenuList}
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
