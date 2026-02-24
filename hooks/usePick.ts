import { Pick, Track } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const pickQueryKey = (pickId: string) => ["pick", pickId];

export function usePick(pickId: string) {
  const {
    data: pick,
    isLoading: isPickLoading,
    refetch: refetchPick,
  } = useQuery<Pick>({
    queryKey: pickQueryKey(pickId),
    queryFn: () => fetch(`${apiUrl}/pick/${pickId}`).then((res) => res.json()),
  });

  return { pick, isPickLoading, refetchPick };
}

export function useMusicApiSearch(search: string | null) {
  const isEnabled = !!search && search.length >= 3;

  const { data: tracks, isLoading: isTracksLoading } = useQuery<Track[]>({
    queryKey: ["musicSearch", search],
    queryFn: () =>
      fetch(`${apiUrl}/pick/search/${search}`).then((res) => res.json()),
    enabled: isEnabled,
  });

  return { tracks, isTracksLoading };
}
