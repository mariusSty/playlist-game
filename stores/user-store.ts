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
  currentRoom: { pin: string } | null;
  isReady: boolean;
  init: () => Promise<void>;
  setName: (name: string) => void;
  setCurrentRoom: (room: { pin: string }) => void;
  clearCurrentRoom: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: { id: "", name: "" },
  currentRoom: null,
  isReady: false,
  init: async () => {
    let id = await SecureStore.getItemAsync("uuid");
    const name = (await SecureStore.getItemAsync("name")) ?? "";
    const currentRoomJson = await SecureStore.getItemAsync("currentRoom");
    const currentRoom = currentRoomJson ? JSON.parse(currentRoomJson) : null;
    if (!id) {
      id = uuidv4();
      await SecureStore.setItemAsync("uuid", id);
    }
    set({ user: { id, name }, currentRoom, isReady: true });
  },
  setName: (name) => {
    set({ user: { ...get().user, name } });
    SecureStore.setItemAsync("name", name);
  },
  setCurrentRoom: (room) => {
    set({ currentRoom: room });
    SecureStore.setItemAsync("currentRoom", JSON.stringify(room));
  },
  clearCurrentRoom: () => {
    set({ currentRoom: null });
    SecureStore.deleteItemAsync("currentRoom");
  },
}));
