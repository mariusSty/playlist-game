import { Round } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const roundQueryKey = (roundId: string) => ["round", roundId];

export function useRound(roundId: string) {
  const {
    data: round,
    isLoading: isRoundLoading,
    refetch: refetchRound,
  } = useQuery<Round>({
    queryKey: roundQueryKey(roundId),
    queryFn: () =>
      fetch(`${apiUrl}/round/${roundId}`).then((res) => res.json()),
  });

  return { round, isRoundLoading, refetchRound };
}
