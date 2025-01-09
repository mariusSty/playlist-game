import { Game, Pick, Room } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useGame(pin: string) {
  const {
    data: game,
    isLoading: isGameLoading,
    mutate,
  } = useSWR<Game>(`${apiUrl}/game/${pin}`, fetcher);

  return { game, isGameLoading, mutate };
}

export function useGameRoom(pin: string) {
  const {
    data: room,
    isLoading: isRoomLoading,
    mutate,
  } = useSWR<Room>(`${apiUrl}/room/${pin}`, fetcher);

  return { room, isRoomLoading, mutate };
}

export function useGameVotes(pin: string) {
  const {
    data: votes,
    isLoading: isVotesLoading,
    mutate,
  } = useSWR<Pick>(`${apiUrl}/game/${pin}/votes`, fetcher);

  return { votes, isVotesLoading, mutate };
}
