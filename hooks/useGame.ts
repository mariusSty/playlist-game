import { Game, Pick, Room } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useGame(pin: string) {
  const {
    data: game,
    isLoading: isGameLoading,
    mutate: mutateGame,
  } = useSWR<Game>(`${apiUrl}/game/${pin}`, fetcher);

  return { game, isGameLoading, mutateGame };
}

export function useRoom(pin: string) {
  const {
    data: room,
    isLoading: isRoomLoading,
    mutate: mutateRoom,
  } = useSWR<Room>(`${apiUrl}/room/${pin}`, fetcher);

  return { room, isRoomLoading, mutateRoom };
}

export function usePick(pickId: string) {
  const {
    data: pick,
    isLoading: isPickLoading,
    mutate: mutatePick,
  } = useSWR<Pick>(`${apiUrl}/game/pick/${pickId}`, fetcher);

  return { pick, isPickLoading, mutatePick };
}
