import { Theme } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/server";
import useSWR from "swr";

export function useTheme() {
  const {
    data: themes = [],
    isLoading: isThemeLoading,
    mutate,
  } = useSWR<Theme[]>(`${apiUrl}/theme?limit=4`, fetcher);

  return { themes, isThemeLoading, mutate };
}
