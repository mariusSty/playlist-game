import { GamePhase } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const gamePhaseQueryKey = (gameId: string) => ["gamePhase", gameId];

export function useGamePhase(gameId: string) {
  const { data: gamePhase, isLoading: isGamePhaseLoading } =
    useQuery<GamePhase>({
      queryKey: gamePhaseQueryKey(gameId),
      queryFn: () =>
        fetch(`${apiUrl}/game/${gameId}/phase`).then((res) => res.json()),
      refetchInterval: 10_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!gameId,
    });

  return { gamePhase, isGamePhaseLoading };
}
