import { Room } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

type CreateRoomParams = {
  name: string;
  id: string;
};

type JoinRoomParams = {
  pin: string;
  id: string;
  name: string;
};

type LeaveRoomParams = {
  pin: string;
  userId: string;
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
      const { pin, id, name } = params;
      const res = await fetch(`${apiUrl}/room/${pin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const data = await res.json();
      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    },
  });
}

export function useLeaveRoom() {
  return useMutation({
    mutationFn: async (params: LeaveRoomParams): Promise<void> => {
      const res = await fetch(
        `${apiUrl}/room/${params.pin}/users/${params.userId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        throw new Error("Failed to leave room");
      }
    },
  });
}
