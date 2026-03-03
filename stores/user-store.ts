import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export type User = {
  id: string;
  name: string;
};

interface UserState {
  user: User;
  isReady: boolean;
  init: () => Promise<void>;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: { id: "", name: "" },
  isReady: false,
  init: async () => {
    let id = await SecureStore.getItemAsync("uuid");
    const name = (await SecureStore.getItemAsync("name")) ?? "";
    if (!id) {
      id = uuidv4();
      await SecureStore.setItemAsync("uuid", id);
    }
    set({ user: { id, name }, isReady: true });
  },
  setName: (name) => {
    set({ user: { ...get().user, name } });
    SecureStore.setItemAsync("name", name);
  },
}));
