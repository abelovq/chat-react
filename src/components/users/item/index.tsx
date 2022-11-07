import React, { FC } from 'react';
import { useTypedSelector } from '../../../store/types';
import { Avatar, IconStatus, ChatUserBody } from '../../../styled.components';
import { Message, Status } from '../../../utils/types';

import './styles.scss';

type Props = {
  id: number;
  name?: string;
  status: Status;
  lastMessage?: Message;
  onClick: (id: number) => void;
  notReadMessagesComp?: React.ReactNode;
  onContextClick: (e: React.MouseEvent) => void;
};

export const ChatUserItem: FC<Props> = ({
  id,
  name,
  status,
  onClick,
  lastMessage,
  notReadMessagesComp,
  onContextClick,
}) => {
  const { whoIsTypingInChat } = useTypedSelector((state) => state.whoIsTyping);

  const handleContextClick = (e: React.MouseEvent) => onContextClick(e);

  const handleClick = () => onClick(id);

  return (
    <div
      onContextMenu={handleContextClick}
      onClick={handleClick}
      style={{ display: 'flex', overflow: 'hidden', width: '100%' }}
    >
      <Avatar>
        {name?.[0]}
        {status === 'online' && <IconStatus />}
      </Avatar>

      <ChatUserBody>
        <span>{name}</span>
        <span
          style={{
            fontSize: 14,
            color: 'inherit',
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {whoIsTypingInChat[id!]?.state
            ? `typing...`
            : (lastMessage?.text as string)}
        </span>
      </ChatUserBody>
      {notReadMessagesComp}
    </div>
  );
};
