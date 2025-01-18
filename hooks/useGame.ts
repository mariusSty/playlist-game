import { Game, Result } from "@/types/room";
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

export function useResult(gameId: string) {
  const { data: result, isLoading: isResultLoading } = useSWR<Result[]>(
    `${apiUrl}/game/${gameId}/result`,
    fetcher
  );

  return { result, isResultLoading };
}
