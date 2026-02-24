import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type User = {
  id: string | null;
  name: string | null;
};

interface UserState {
  user: User;
  setUser: (user: User) => void;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: { id: null, name: null },
  setUser: (user) => set({ user }),
  setName: (name) => {
    set({ user: { ...get().user, name } });
    SecureStore.setItemAsync("name", name);
  },
}));
