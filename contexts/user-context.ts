import { createContext, Dispatch, SetStateAction } from "react";

export type User = {
  id: string | null;
  name: string | null;
};

export const UserContext = createContext<{
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}>({
  user: {
    id: null,
    name: null,
  },
  setUser: () => {},
});
