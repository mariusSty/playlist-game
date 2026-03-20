import { Round } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSessionQueryKey } from "./useUserSession";

type NextRoundParams = {
  pin: string;
  gameId: string;
  userId: string;
};

type NextRoundResponse = {
  nextRoundId: number | null;
};

export function useNextRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: NextRoundParams): Promise<NextRoundResponse> => {
      const res = await fetch(`${apiUrl}/round/next?pin=${params.pin}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to go to next round");
      }
      return res.json();
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: userSessionQueryKey(params.userId),
      });
    },
  });
}

type PickThemeParams = {
  roundId: string;
  theme: string;
  userId: string;
  pin: string;
};

export function usePickTheme() {
  return useMutation({
    mutationFn: async (params: PickThemeParams): Promise<Round> => {
      const res = await fetch(`${apiUrl}/round/${params.roundId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: params.theme,
          userId: params.userId,
          pin: params.pin,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to pick theme");
      }
      return res.json();
    },
  });
}
