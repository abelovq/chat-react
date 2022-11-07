export type Status = 'offline' | 'online';

export type User = {
  email: string;
  name: string;
  lastMessage: Message;
  id: number;
  status: Status;
  friends: number[];
};

export type LoginCreds = {
  email: string;
  password: string;
};

export type MessageDataType = 'video' | 'image';

export type MessageDataDetails = {
  id: number;
  url: string;
  type: MessageDataType;
};

export type Message = {
  id: number;
  text: string;
  data?: MessageDataDetails[];
  createdAt: Date;
  user: User;
  isRead: boolean;
  conversation: { id: number };
};

export type MessageContent = {
  data: { [prop: string]: any };
  senderId: number;
  receiverId: number;
};

export type MessageResponse = {
  messages: Message[];
  totalPages: number;
};

export type Friend = User;

export type EditMessageContent = {
  receiverId: number;
  senderId: number;
  body: Message;
};
