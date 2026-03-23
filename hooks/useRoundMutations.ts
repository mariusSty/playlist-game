import { Round } from "@/types/room";
import { apiUrl } from "@/utils/server";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSessionQueryKey } from "./useUserSession";

type NextRoundParams = {
  pin: string;
  gameId: string;
  userId: string;
  userName: string;
  roundId: string;
};

type NextRoundResponse = {
  nextRoundId: number | null;
};

type PickThemeParams = {
  roundId: string;
  theme: string;
  userId: string;
  userName: string;
  pin: string;
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
      Sentry.logger.info("Next round loaded", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        roundId: params.roundId,
      });
      queryClient.invalidateQueries({
        queryKey: userSessionQueryKey(params.userId),
      });
    },
  });
}

export function usePickTheme() {
  const queryClient = useQueryClient();
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
    onSuccess: (_, params) => {
      Sentry.logger.info("Theme picked", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        theme: params.theme,
      });
      queryClient.invalidateQueries({
        queryKey: userSessionQueryKey(params.userId),
      });
    },
  });
}
