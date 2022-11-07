import React, { FC, useRef } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

import { useClickOutside } from '../hooks';
import {
  FriendContextMenuProps,
  FriendListItemTypes,
} from './friendContextMenu';
import { UserContextMenuProps, UserListItemTypes } from './userContextMenu';

import './styles.scss';
import {
  MessageContextMenuProps,
  MessageListItemTypes,
} from '../components/messages/item';

export type ListItemType<T> = {
  text: string;
  type: T;
};

export type onContextMenuActionsType =
  | FriendListItemTypes
  | UserListItemTypes
  | MessageListItemTypes;

type Props = (
  | FriendContextMenuProps
  | UserContextMenuProps
  | MessageContextMenuProps
) & {
  onContextMenuActions: (type: onContextMenuActionsType) => void;
};

const ContextMenu: FC<Props> = ({
  list,
  visible,
  pos,
  onClickOutside,
  onContextMenuActions,
}) => {
  const clickRef = useRef(null);
  useClickOutside(clickRef, onClickOutside);

  return ReactDOM.createPortal(
    <>
      {visible && (
        <div className='ctx-menu-wrapper' style={{ ...pos }}>
          <ul className='ctx-menu' ref={clickRef}>
            {list.map((el) => (
              <li
                key={el.type}
                className={classNames('li')}
                onClick={() => onContextMenuActions(el.type)}
              >
                {el.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>,
    document.body
  );
};

export default ContextMenu;
