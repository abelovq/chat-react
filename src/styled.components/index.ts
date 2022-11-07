import styled from 'styled-components';

export const InputContainer = styled.div`
  width: 100%;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const InputLabel = styled.label`
  color: #aaa;
  display: block;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  height: 20px;
  padding: 5px 0;
  border: none;
  outline: none;
  font-size: 16px;
`;

export const AppContainer = styled.div`
  height: 100%;
  display: flex;
  font-size: 16px;
`;

export const Button = styled.button`
  width: 100%;
  background-color: blue;
  border: none;
  padding: 10px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
`;

type AsideProps = {
  position: 'left' | 'right';
};

export const Aside = styled.div<AsideProps>`
  position: fixed;
  width: 300px;
  height: 100%;
  border-right: ${(p) => p.position === 'left' && '1px solid #ccc'};
  border-left: ${(p) => p.position === 'right' && '1px solid #ccc'};

  padding: 20px;
  right: ${(p) => p.position === 'right' && 0};
`;

type ChatUserItemWrapperProps = {
  active: boolean;
};

export const ChatUserItemWrapper = styled.div<ChatUserItemWrapperProps>`
  display: flex;
  padding: 8px;
  width: 100%;
  max-width: 300px;
  background-color: ${(p) => (p.active ? '#3390EC' : '#eee')};
  border-radius: 10px;
  position: relative;
  color: ${(p) => (p.active ? '#fff' : '#000')};
  cursor: pointer;
  :hover {
    background-color: ${(p) => !p.active && '#e7e7e7'};
  }
`;

export const ChatUserBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
  justify-content: center;
  text-align: start;
  overflow: hidden;
`;

type AvatarProps = {
  square?: boolean;
};

export const Avatar = styled.div<AvatarProps>`
  width: 50px;
  height: 50px;
  border-radius: ${(p) => (p.square ? '10px' : '50%')};
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #000;
  background-color: #fff;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 50px;
  position: relative;
`;

export const ConversationContainer = styled.main`
  display: flex;
  flex-direction: column;
  position: relative;
  width: calc(100% - 600px);
  margin: 0 auto;
`;

export const ConversationHeader = styled.header`
  height: 80px;
  width: 100%;
  display: flex;
  padding: 20px;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid #ddd;

  z-index: 2;
  background-color: #fff;
`;

export const ConversationBottom = styled.div`
  background-color: #fff;
`;

export const ConversationBody = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  /* flex: 1; */
`;

export const ConversationInputWrapper = styled.div`
  position: relative;

  width: 100%;
  border-top: 1px solid #eee;
  height: 60px;
  padding: 20px 20px 0;

  transition: height 300ms ease-out;

  .form-actions {
    /* position: absolute; */
    top: 25px;
    right: 25px;
  }

  svg:nth-of-type(3) {
    :hover {
      fill: blue;
      cursor: pointer;
    }
  }
  .typing-now {
    position: absolute;
    top: 2px;
    left: 10px;
    display: inline-flex;
    gap: 10px;
  }
  .input-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .input-edit-container {
    display: flex;
    align-items: center;
  }
  .input-edit {
    width: 100%;
    border: none;
    padding: 5px;
    background-color: #fff;
    font-size: 20px;
    outline: none;
  }
`;

export const ConversationInput = styled.input`
  width: calc(100% - 180px);
  height: 100%;
  padding: 5px;
  border: none;
  font-size: 20px;
  outline: none;
  ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 20px;
  }
  :-ms-input-placeholder {
    font-size: 20px;
  }
`;

export const IconStatus = styled.div`
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  right: 3px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #00ff00;
`;

export const SearchInput = styled.input`
  border-radius: 15px;
  border: 1px solid #ccc;
  width: 250px;
  height: 40px;
  padding: 2px 40px 2px 12px;
  outline: none;
`;

type MessagesListProps = {
  firstRender?: boolean;
};

export const MessagesList = styled.ul<MessagesListProps>`
  list-style: none;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
  overflow-y: scroll;
  scroll-behavior: ${(p) => (p.firstRender ? 'initial' : 'smooth')};
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #ccc;
  }
  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;

type MessageType = {
  own: boolean;
  key?: number;
};

export const MessageItem = styled.div<MessageType>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 8px;
  width: max-content;
  min-width: 120px;
  border-radius: 8px;
  background: ${(p) => (p.own ? 'rgb(66, 105, 212)' : '#eee')};
  color: ${(p) => (p.own ? '#fff' : '#000')};
  border-bottom-left-radius: ${(p) => (p.own ? '8px' : 0)};
  border-bottom-right-radius: ${(p) => (p.own ? 0 : '8px')};
  .created-time {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    text-align: end;
    color: ${(p) =>
      p.own ? 'rgba(211, 211, 211, 0.5)' : 'rgba(133, 133, 133, 0.7)'};
  }
`;

export const MessageLiItem = styled.li<MessageType>`
  display: flex;
  width: 100%;
  justify-content: ${(p) => p.own && 'flex-end'};
`;
