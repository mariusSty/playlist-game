import { apiUrl } from "@/utils/server";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSessionQueryKey } from "./useUserSession";

type FinishGameParams = {
  gameId: string;
  userId: string;
};

type StartGameParams = {
  pin: string;
  userId: string;
  userName: string;
};

type StartGameResponse = {
  roundId: number;
  gameId: number;
};

export function useFinishGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gameId,
    }: FinishGameParams): Promise<{ finished: true }> => {
      const res = await fetch(`${apiUrl}/game/${gameId}/finish`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to finish game");
      }
      return res.json();
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Game finished", {
        gameId: params.gameId,
        userId: params.userId,
      });
      queryClient.invalidateQueries({
        queryKey: userSessionQueryKey(params.userId),
      });
    },
  });
}

export function useStartGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
    }: StartGameParams): Promise<StartGameResponse> => {
      const res = await fetch(`${apiUrl}/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        throw new Error("Failed to start game");
      }
      return res.json();
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Game started", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
      });
      queryClient.invalidateQueries({
        queryKey: userSessionQueryKey(params.userId),
      });
    },
  });
}
