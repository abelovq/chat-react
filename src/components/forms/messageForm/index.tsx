import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BsArrowUpCircle, BsCheckCircleFill, BsMic } from 'react-icons/bs';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { useTyping } from '../../../hooks';
import {
  useEditMessageMutation,
  useSendMessageMutation,
} from '../../../store/services/messages';
import { socket } from '../../../store/services/socket';
import { selectCurrentUser } from '../../../store/slices/auth.slice';
import { setMessageSent } from '../../../store/slices/features/hasMessageSent.slice';
import {
  setStopTypingInChat,
  setWhoIsTypingInChat,
} from '../../../store/slices/features/whoIsTyping.slice';
import {
  cancelEdit,
  selectEditEditingMessage,
  selectEditOpen,
} from '../../../store/slices/messages.slice';
import { Events, useAppDispatch, useTypedSelector } from '../../../store/types';
import {
  ConversationBottom,
  ConversationInput,
  ConversationInputWrapper,
} from '../../../styled.components';
import { Message } from '../../../utils/types';
import { TypingAnimation } from '../../animation/typing';

type Props = {};

const MessageFormSend: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [files, setFiles] = useState([]);

  const { id } = useParams();
  const user = useTypedSelector(selectCurrentUser);
  const editOpen = useTypedSelector(selectEditEditingMessage);
  const editingMessage = useTypedSelector(selectEditEditingMessage);

  const { whoIsTypingInChat } = useTypedSelector((state) => state.whoIsTyping);

  const selectedId = useTypedSelector((state) => state.selectedId);

  const [text, setText] = useState('');
  const input = useTyping(text, () => {
    if (user?.id) {
      const data = whoIsTypingInChat[user.id];
      if (data && data.state) {
        socket?.emit(Events.STOP_TYPING, { who: user.id, toWhom: +id! });

        dispatch(setStopTypingInChat({ id: user.id, name: null }));
      }
    }
  });

  const inputRef = useCallback(
    (node: any) => {
      if (node !== null) {
        if (editOpen) {
          node.focus();
        }
      }
    },
    [editOpen]
  );

  useEffect(() => {
    if (editOpen && editingMessage) {
      setText(editingMessage.text);
    }
  }, [editOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    socket?.emit(Events.TYPING, { who: user?.id, toWhom: id });
    dispatch(setWhoIsTypingInChat({ id: user?.id!, name: user?.name! }));
    setText(e.target.value);
  };

  const gatherData = () => {
    const data = { files: [] } as { [prop: string]: any };
    data.text = text;
    for (let i = 0; i < files.length; i++) {
      data.files.push(files[i]);
    }

    return data;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = gatherData();

    sendMessage({ senderId: user!.id, receiverId: +id!, data });
    dispatch(setMessageSent(true));
    setText('');
    setFiles([]);
  };

  const handleChangeleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files as any));
  };

  const handleCancelEdit = () => {
    dispatch(cancelEdit());
    setText('');
  };

  const handleSendMessage = () => {
    const data = gatherData();
    sendMessage({ senderId: user!.id, receiverId: +id!, data });
    setText('');
  };

  const handleApproveEdit = async () => {
    await editMessage({
      senderId: user!.id,
      receiverId: +id!,
      body: { ...editingMessage, text } as Message,
    });
    handleCancelEdit();
  };

  const renderFormActions = () => {
    if (editOpen)
      return (
        <span onClick={handleApproveEdit}>
          <BsCheckCircleFill size={30} />
        </span>
      );
    return (
      <>
        <span onClick={handleSendMessage}>
          <BsArrowUpCircle size={30} />
        </span>
        <label htmlFor='file'>
          <IoDocumentAttachOutline size={30} />
          <input
            id='file'
            type='file'
            multiple={true}
            style={{ display: 'none' }}
            onChange={handleChangeleFileChange}
          />
        </label>
        <BsMic size={30} />
      </>
    );
  };

  return (
    <ConversationBottom>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <ConversationInputWrapper style={{ height: editOpen ? 120 : 60 }}>
          <div className='typing-now'>
            {whoIsTypingInChat[selectedId!]?.state ? (
              <>
                <TypingAnimation />
                typing
              </>
            ) : null}
          </div>
          <div className='input-edit-container'>
            {editOpen && (
              <>
                <AiFillEdit size={25} />
                <input
                  className='input-edit'
                  disabled
                  value={editingMessage?.text}
                />
                <span onClick={handleCancelEdit}>
                  <AiFillCloseCircle size={25} />
                </span>
              </>
            )}
          </div>
          <div className='input-container'>
            <ConversationInput
              value={input}
              onChange={handleChange}
              placeholder='Write a message...'
              ref={inputRef}
            />
            <div className='form-actions'>{renderFormActions()}</div>
          </div>
        </ConversationInputWrapper>
      </form>
    </ConversationBottom>
  );
};

export default memo(MessageFormSend);
