import { Standing } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export function useStandings(gameId: string, roundId: string) {
  const { data: standings, isLoading: isStandingsLoading } = useQuery<
    Standing[]
  >({
    queryKey: ["standings", gameId, roundId],
    queryFn: () =>
      fetch(`${apiUrl}/game/${gameId}/standings/${roundId}`).then((res) =>
        res.json(),
      ),
  });

  return { standings, isStandingsLoading };
}
