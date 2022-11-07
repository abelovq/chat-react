import React, { FC, useRef } from 'react';

import { useClickOutside } from '../hooks';
import ContextMenu, {
  ListItemType,
  onContextMenuActionsType,
} from './contextMenu';

export type FriendListItemTypes = 'open' | 'add' | 'remove';

export type FriendContextMenuProps = {
  visible: boolean;
  pos: { top: number; left: number };
  onClickOutside: () => void;
  list: ListItemType<FriendListItemTypes>[];
  userId: number;
  onOpenConversation: (id: number) => void;
  onAddToFriends: (id: number) => void;
  onRemoveFromFriends: (id: number) => void;
};

const FriendContextMenu: FC<FriendContextMenuProps> = (props) => {
  const {
    userId,
    list,
    visible,
    pos,
    onClickOutside,
    onOpenConversation,
    onAddToFriends,
    onRemoveFromFriends,
  } = props;
  const clickRef = useRef(null);
  useClickOutside(clickRef, onClickOutside);

  const handleContextMenuActions = (type: onContextMenuActionsType) => {
    onClickOutside();
    switch (type) {
      case 'open':
        onOpenConversation(userId);
        break;
      case 'add':
        onAddToFriends(userId);
        break;
      case 'remove':
        onRemoveFromFriends(userId);
        break;
      default:
        console.log('DEFAULT');
    }
  };

  return (
    <ContextMenu {...props} onContextMenuActions={handleContextMenuActions} />
  );
};

export default FriendContextMenu;
