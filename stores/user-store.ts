import { create } from "zustand";

export type User = {
  id: string | null;
  name: string | null;
};

interface UserState {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: { id: null, name: null },
  setUser: (user) => set({ user }),
}));
