import { Room } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const roomQueryKey = (pin: string) => ["room", pin];

export function useRoom(pin: string) {
  const {
    data: room,
    isLoading: isRoomLoading,
    refetch: refetchRoom,
  } = useQuery<Room>({
    queryKey: roomQueryKey(pin),
    queryFn: () => fetch(`${apiUrl}/room/${pin}`).then((res) => res.json()),
  });

  return { room, isRoomLoading, refetchRoom };
}
