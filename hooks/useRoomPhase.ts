import { RoomPhase } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const roomPhaseQueryKey = (pin: string) => ["roomPhase", pin];

export function useRoomPhase(pin: string | undefined) {
  const { data: roomPhase, isLoading: isRoomPhaseLoading } =
    useQuery<RoomPhase>({
      queryKey: roomPhaseQueryKey(pin ?? ""),
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/room/${pin}/phase`);
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      },
      refetchInterval: 10_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!pin,
    });

  return { roomPhase, isRoomPhaseLoading };
}
