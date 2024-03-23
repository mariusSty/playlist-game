export type Room = {
  id: string;
  pin: string;
  users: User[];
};

type User = {
  id: string;
  name: string;
};
