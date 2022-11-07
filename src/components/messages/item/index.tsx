import React, { FC, useMemo } from 'react';

import { BiCheckDouble, BiCheck } from 'react-icons/bi';
import ContextMenu, {
  ListItemType,
  onContextMenuActionsType,
} from '../../../contextMenu/contextMenu';
import { useContextMenu } from '../../../hooks';
import { setEdit } from '../../../store/slices/messages.slice';
import { useAppDispatch, useTypedSelector } from '../../../store/types';
import { MessageItem, MessageLiItem } from '../../../styled.components';
import { getTtime } from '../../../utils/functions/functions';
import { Message } from '../../../utils/types';

type Props = {
  message: Message;
  withContextMenu: boolean;
  rowRef: any;
};

export type MessageListItemTypes = 'edit';

const MessageContextMenuList: ListItemType<MessageListItemTypes>[] = [
  { text: 'Edit', type: 'edit' },
];

export type MessageContextMenuProps = {
  list: ListItemType<MessageListItemTypes>[];
  visible: boolean;
  pos: { top: number; left: number };
  onClickOutside: () => void;
};

const MessageById: FC<Props> = ({ rowRef, message, withContextMenu }) => {
  const { user } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { visible, onItemClick, onClickOutside } = useContextMenu();

  const renderIsMessageReadByUser = (userId: number, isRead: boolean) => {
    if (userId === user?.id) {
      if (isRead) {
        return <BiCheckDouble />;
      }
      return <BiCheck />;
    }
    return null;
  };

  const isOwn = useMemo(() => {
    return user?.id === message.user.id;
  }, [message.user.id, user?.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOwn) {
      onItemClick({ id: message.id, pos: { left: e.pageX, top: e.pageY } });
    }
  };

  const handleContextMenuActions = (type: onContextMenuActionsType) => {
    onClickOutside();
    switch (type) {
      case 'edit':
        dispatch(setEdit(message));
        break;
      default:
        console.log('DEFAULT');
    }
  };

  return (
    <MessageLiItem key={message.id} own={isOwn} ref={rowRef}>
      <MessageItem own={isOwn} onContextMenu={handleClick}>
        <span>{message?.text}</span>
        {message?.data &&
          message?.data.length > 0 &&
          message.data.map((item) => {
            switch (item.type) {
              case 'image':
                return (
                  <div key={item.id}>
                    <img
                      src={item.url}
                      alt=''
                      width='400'
                      height='400'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                );
              case 'video':
                return (
                  <div key={item.id}>
                    <video controls src={item.url} width='400' height='400' />
                  </div>
                );
              default:
                return (
                  <div key={item.id}>
                    {' '}
                    <img src={item.url} alt='' />
                  </div>
                );
            }
          })}

        <span className='created-time'>{getTtime(message?.createdAt)}</span>
        <span style={{ alignSelf: 'end' }}>
          {renderIsMessageReadByUser(message?.user.id!, message?.isRead!)}
        </span>
      </MessageItem>
      {withContextMenu && (
        <ContextMenu
          list={MessageContextMenuList}
          onContextMenuActions={handleContextMenuActions}
          onClickOutside={onClickOutside}
          visible={visible?.id === message.id}
          pos={visible?.pos}
        />
      )}
    </MessageLiItem>
  );
};

export default MessageById;
