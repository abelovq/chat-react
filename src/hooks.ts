import React, { useState, useEffect, useCallback, RefObject } from 'react';
import { VisibleType } from './components/users/list';
import { setMessageSent } from './store/slices/features/hasMessageSent.slice';
import { useAppDispatch, useTypedSelector } from './store/types';

export const useTyping = (text: string, cb: () => void): string => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState(text);
  const messageSent = useTypedSelector((state) => state.hasMessageSent);
  useEffect(() => {
    setInput(text);

    const id = setTimeout(() => {
      if (input.length === text.length) {
        cb();
      }
    }, 2000);
    if (messageSent) {
      cb();
      clearTimeout(id);
    }
    return () => {
      clearTimeout(id);
      dispatch(setMessageSent(false));
    };
  }, [cb, dispatch, input.length, messageSent, text]);

  return input;
};

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) => {
  const handleClick = useCallback(
    (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
    [callback, ref]
  );
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);
};

export const useContextMenu = () => {
  const initState = {
    id: null,
    pos: { left: 0, top: 0 },
  };

  const [visible, setVisible] = useState<VisibleType>(initState);

  const onClickOutside = () => {
    setVisible(initState);
  };

  const onItemClick = (value: VisibleType) => {
    setVisible(value);
  };

  return { visible, onClickOutside, onItemClick };
};
