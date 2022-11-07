import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Message } from '../../../utils/types';
import MessageById from '../item';

type Props = MessagesListProps & {
  height: number | string;
  width: number | string;
};

const Messages: FC<Props> = ({ height, width, messages, isLoading }) => {
  const listRef = useRef() as any;
  const lastRowRef = useRef() as any;
  const sizeMap = useRef({});

  const [scrollAtBottom, setScrollAtBottom] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollToItem(messages?.length);
        setScrollAtBottom(true);
      }
    };

    scrollToBottom();
  }, [messages]);

  const getSize = (index: number) => {
    return (sizeMap.current as any)[index] || 0;
  };

  if (isLoading) return <div>Loading ...</div>;

  return (
    <>
      {messages && messages?.length === 0 ? (
        <h1 style={{ padding: 20 }}>say hello</h1>
      ) : (
        <>
          <List
            className='List'
            height={height}
            ref={listRef}
            itemCount={messages?.length!}
            itemSize={getSize}
            itemData={messages}
            width={'100%'}
          >
            {({ data, index, style }) => {
              return (
                <div style={style}>
                  <Row index={index} data={data} setSize={setSize} />
                </div>
              );
            }}
          </List>
          <div ref={lastRowRef}></div>
        </>
      )}
    </>
  );
};

type MessagesListProps = {
  messages?: Message[];
  newMessagesFetching: boolean;
  isLoading: boolean;
};

export const MessagesList: FC<MessagesListProps> = (props) => {
  return (
    <AutoSizer style={{ height: '100%', width: '100%' }}>
      {({ height, width }) => (
        <Messages {...props} height={height} width={width} />
      )}
    </AutoSizer>
  );
};

type RowProps = {
  data: Message[];
  index: number;
  setSize: (index: number, size: number) => void;
};

const Row: FC<RowProps> = ({ data, index, setSize }) => {
  const rowRef = useRef() as any;

  React.useEffect(() => {
    setSize(index, rowRef.current.getBoundingClientRect().height);
  }, [index, setSize]);

  return (
    <MessageById
      withContextMenu={true}
      rowRef={rowRef}
      message={data?.[index]!}
    />
  );
};

export default memo(Messages);
