import { UserSession } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useQuery } from "@tanstack/react-query";

export const userSessionQueryKey = (userId: string) => ["userSession", userId];

export function useUserSession(userId: string | undefined) {
  const { data: userSession, isLoading: isUserSessionLoading } =
    useQuery<UserSession>({
      queryKey: userSessionQueryKey(userId ?? ""),
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/user/${userId}/session`);
        if (res.status === 404) {
          return { phase: "home" } satisfies UserSession;
        }
        if (!res.ok) throw new Error("Failed to fetch user session");
        return res.json();
      },
      refetchInterval: 5_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!userId,
    });

  return { userSession, isUserSessionLoading };
}
