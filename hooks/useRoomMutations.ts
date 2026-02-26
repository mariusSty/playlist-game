import { Room } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

type CreateRoomParams = {
  name: string | null;
  id: string | null;
};

type JoinRoomParams = {
  pin: string;
  id: string | null;
  name: string | null;
};

export function useCreateRoom() {
  return useMutation({
    mutationFn: async (params: CreateRoomParams): Promise<Room> => {
      const res = await fetch(`${apiUrl}/room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error("Failed to create room");
      }
      return res.json();
    },
  });
}

export function useJoinRoom() {
  return useMutation({
    mutationFn: async (params: JoinRoomParams): Promise<Room> => {
      const res = await fetch(`${apiUrl}/room/${params.pin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    },
  });
}
