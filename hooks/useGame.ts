import { Game, Result } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const gameQueryKey = (gameId: string) => ["game", gameId];

export function useGame(gameId: string | undefined) {
  const { data: game, isLoading: isGameLoading } = useQuery<Game>({
    queryKey: gameQueryKey(gameId ?? ""),
    queryFn: () =>
      fetch(`${apiUrl}/game/${gameId}`).then((res) => res.json()),
    enabled: Boolean(gameId),
  });

  return { game, isGameLoading };
}

export function useResult(gameId: string) {
  const { data: result, isLoading: isResultLoading } = useQuery<Result[]>({
    queryKey: ["result", gameId],
    queryFn: () =>
      fetch(`${apiUrl}/game/${gameId}/result`).then((res) => res.json()),
  });

  return { result, isResultLoading };
}
