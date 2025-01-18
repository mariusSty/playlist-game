import { Pick, Track } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function usePick(pickId: string) {
  const {
    data: pick,
    isLoading: isPickLoading,
    mutate: mutatePick,
  } = useSWR<Pick>(`${apiUrl}/pick/${pickId}`, fetcher);

  return { pick, isPickLoading, mutatePick };
}

export function useMusicApiSearch(search: string | null) {
  const { data: tracks, isLoading: isTracksLoading } = useSWR<Track[]>(
    search && search.length >= 3 ? `${apiUrl}/pick/search/${search}` : null,
    fetcher
  );

  return { tracks, isTracksLoading };
}
