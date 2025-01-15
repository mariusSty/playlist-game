import { Game, Pick, Result, Room, Round } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useGame(gameId: string) {
  const {
    data: game,
    isLoading: isGameLoading,
    mutate: mutateGame,
  } = useSWR<Game>(`${apiUrl}/game/${gameId}`, fetcher);

  return { game, isGameLoading, mutateGame };
}

export function useRound(roundId: string) {
  const {
    data: round,
    isLoading: isRoundLoading,
    mutate: mutateRound,
  } = useSWR<Round>(`${apiUrl}/round/${roundId}`, fetcher);

  return { round, isRoundLoading, mutateRound };
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
  } = useSWR<Pick>(`${apiUrl}/pick/${pickId}`, fetcher);

  return { pick, isPickLoading, mutatePick };
}

export function useResult(gameId: string) {
  const { data: result, isLoading: isResultLoading } = useSWR<Result[]>(
    `${apiUrl}/game/${gameId}/result`,
    fetcher
  );

  return { result, isResultLoading };
}
