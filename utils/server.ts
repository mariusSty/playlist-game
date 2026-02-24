import { io } from "socket.io-client";

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
  transports: ["websocket"],
  autoConnect: false,
});
