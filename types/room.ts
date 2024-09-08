export type Room = {
  id: string;
  pin: string;
  users: User[];
};

export type User = {
  id: string;
  name: string;
};

export type Theme = {
  id: string;
  description: string;
};
