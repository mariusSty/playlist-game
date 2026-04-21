import { Theme } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const themesQueryKey = ["themes"] as const;

export function useThemes() {
  const { data: themes, isLoading: isThemesLoading } = useQuery<Theme[]>({
    queryKey: themesQueryKey,
    queryFn: () => fetch(`${apiUrl}/theme`).then((res) => res.json()),
  });

  return { themes, isThemesLoading };
}
