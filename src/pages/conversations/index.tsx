import React, { useEffect } from 'react';
import _ from 'lodash';
import { useAppDispatch, useTypedSelector } from '../../store/types';
import {
  Avatar,
  ConversationBody,
  ConversationContainer,
  ConversationHeader,
  SearchInput,
} from '../../styled.components';
import { Message } from '../../utils/types';
import { AiOutlineSearch } from 'react-icons/ai';

import { BiExit } from 'react-icons/bi';

import { useGetFriendsQuery } from '../../store/services/users';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogoutMutation } from '../../store/services/auth';

import MessageFormSend from '../../components/forms/messageForm';
import { AsideLeft } from '../../components/aside/left';
import { MessagesList as Messages } from '../../components/messages/list';
import { AsideRight } from '../../components/aside/right';
import { useGetConversationStreamMessagesQuery } from '../../store/services/messages';

import { logout as logoutAction } from '../../store/slices/auth.slice';

import { selectEditEditingMessage } from '../../store/slices/messages.slice';

import './styles.scss';

const Conversations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuth } = useTypedSelector((state) => state.auth);

  const editOpen = useTypedSelector(selectEditEditingMessage);

  const selectedId = useTypedSelector((state) => state.selectedId);
  // const [isIntersecting, setIsIntersecting] = useState(false);

  const {
    data: friends,
    isLoading: friendsLoading,
    refetch: refetchFriends,
  } = useGetFriendsQuery(undefined, {
    skip: !isAuth,
  });

  const {
    data: stream,
    isError: streamError,
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchMessages,
  } = useGetConversationStreamMessagesQuery(
    {
      senderId: user?.id as number,
      receiverId: +id! as number,
    },
    {
      skip: !user?.id || !id,
    }
  );

  // const memoSkip = useMemo(() => {
  //   if (!id || !user?.id) {
  //     return true;
  //   }
  //   if (isIntersecting) {
  //     if (stream?.length! < pageSize) {
  //       return true;
  //     }
  //     if (page > totalPages) {
  //       return true;
  //     }
  //   }
  //   if (!isIntersecting) {
  //     return true;
  //   }
  //   return false;
  // }, [id, isIntersecting, page, stream?.length, totalPages, user?.id]);

  // variant of progressive loading content - some lags if a lot of elements in the DOM

  // const {
  //   currentData: newMessages,
  //   isLoading: messageLoading,
  //   isFetching: newMessagesFetching,
  //   isError: newMessagesError,
  //   refetch: refetchMessages,
  // } = useGetConversationMessagesQuery(
  //   {
  //     page,
  //     senderId: user?.id as number,
  //     receiverId: +id! as number,
  //   },
  //   {
  //     skip: memoSkip,
  //   }
  // );

  useEffect(() => {
    refetchFriends();
  }, [stream, refetchFriends]);

  useEffect(() => {
    if (selectedId) {
      refetchMessages();
    }
  }, [selectedId, refetchFriends]);

  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
    dispatch(logoutAction());
    navigate('/login');
  };

  // if (newMessagesError || streamError) return <div>An error has occurred!</div>;
  return (
    <>
      <AsideLeft friends={friends} />
      <ConversationContainer>
        <ConversationHeader>
          <Avatar>{user?.name[0]}</Avatar>
          <div className='search-input-wrapper'>
            <SearchInput />
            <AiOutlineSearch size={25} />
          </div>
          <div style={{ marginLeft: 'auto' }} onClick={handleLogout}>
            <BiExit size={35} />
          </div>
        </ConversationHeader>
        {!id ? null : (
          <>
            <ConversationBody
              style={{
                flex: editOpen ? 0 : 1,
                minHeight: 'calc(100% - 200px)',
              }}
            >
              <Messages
                messages={stream as Message[]}
                newMessagesFetching={false}
                isLoading={isLoading}
              />
            </ConversationBody>
            <MessageFormSend />
          </>
        )}
      </ConversationContainer>
      <AsideRight friends={friends} />
    </>
  );

  // <Aside>
  //         <Users currUser={currUser} users={users} />
  //       </Aside>
  //       <main className='main'>
  //         {currUser.receiveUserId && (
  //           <>
  //             <Canvas paint />
  //             <Canvas />
  //             <form
  //               className='main-form'
  //               action=''
  //               onSubmit={(e) => {
  //                 e.preventDefault();
  //                 console.log('click');
  //                 // dispatch({ type: 'send_msg', payload: value });
  //                 dispatch({
  //                   type: 'message/send',
  //                   payload: {
  //                     msg: value,
  //                     sendUserId: currUser.id,
  //                     receiveUserId: currUser.receiveUserId,
  //                     conversationId: currUser.conversationId,
  //                   },
  //                 });
  //                 setValue('');
  //               }}
  //             >
  //               <input
  //                 value={value}
  //                 onChange={(e) => {
  //                   setValue(e.target.value);
  //                   dispatch({
  //                     type: 'typing',
  //                     payload: {
  //                       name: currUser.name,
  //                       conversationId: currUser.conversationId,
  //                     },
  //                   });
  //                 }}
  //                 className='chat-input'
  //                 type='text'
  //               />
  //               {typing.length > 0 && `${typing.join()} is typing`}
  //               <button style={{ padding: 10 }} type='submit'>
  //                 SEND
  //               </button>
  //             </form>

  //             <ul className='main-messages'>
  //               {currUser.name}
  //               {messages.map(({ text, userId }) => {
  //                 const isCurrUserMsg =
  //                   userId === 'system'
  //                     ? 'message-item message-item--system'
  //                     : currUser.id === userId
  //                     ? 'message-item message-item--own'
  //                     : 'message-item message-item--foreign';
  //                 return <li className={isCurrUserMsg}>{text}</li>;
  //               })}
  //             </ul>
  //           </>
  //         )}
  //       </main>
};

export default Conversations;
