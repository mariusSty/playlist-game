import { Round } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useRound(roundId: string) {
  const {
    data: round,
    isLoading: isRoundLoading,
    mutate: mutateRound,
  } = useSWR<Round>(`${apiUrl}/round/${roundId}`, fetcher);

  return { round, isRoundLoading, mutateRound };
}
