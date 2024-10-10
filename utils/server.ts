import { io } from "socket.io-client";

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());
export const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/rooms`);
