export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
