import { Room } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useRoom(pin: string) {
  const {
    data: room,
    isLoading: isRoomLoading,
    mutate: mutateRoom,
  } = useSWR<Room>(`${apiUrl}/room/${pin}`, fetcher);

  return { room, isRoomLoading, mutateRoom };
}
