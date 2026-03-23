import { Track } from "@/types/room";
import { apiUrl } from "@/utils/server";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pickQueryKey } from "./usePick";
import { roundQueryKey } from "./useRound";

type ValidatePickParams = {
  pin: string;
  roundId: string;
  userId: string;
  userName: string;
  track: Track;
};

type CancelPickParams = {
  pin: string;
  roundId: string;
  userId: string;
  userName: string;
};

type VoteParams = {
  pin: string;
  roundId: string;
  pickId: string;
  guessId: string;
  userId: string;
  userName: string;
};

type CancelVoteParams = {
  pin: string;
  roundId: string;
  pickId: string;
  userId: string;
  userName: string;
};

export function useValidatePick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: ValidatePickParams): Promise<void> => {
      const res = await fetch(`${apiUrl}/pick?pin=${params.pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundId: params.roundId,
          userId: params.userId,
          track: params.track,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to validate pick");
      }
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Song pick validated", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        roundId: params.roundId,
      });
      queryClient.invalidateQueries({
        queryKey: roundQueryKey(params.roundId),
      });
    },
  });
}

export function useCancelPick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CancelPickParams): Promise<void> => {
      const res = await fetch(
        `${apiUrl}/pick/${params.roundId}/${params.userId}?pin=${params.pin}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        throw new Error("Failed to cancel pick");
      }
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Song pick cancelled", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        roundId: params.roundId,
      });
      queryClient.invalidateQueries({
        queryKey: roundQueryKey(params.roundId),
      });
    },
  });
}

export function useVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: VoteParams): Promise<void> => {
      const res = await fetch(`${apiUrl}/vote?pin=${params.pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickId: params.pickId,
          guessId: params.guessId,
          userId: params.userId,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to vote");
      }
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Vote successful", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        roundId: params.roundId,
        pickId: params.pickId,
        guessId: params.guessId,
      });
      queryClient.invalidateQueries({ queryKey: pickQueryKey(params.pickId) });
    },
  });
}

export function useCancelVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CancelVoteParams): Promise<void> => {
      const res = await fetch(
        `${apiUrl}/vote/${params.pickId}/${params.userId}?pin=${params.pin}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        throw new Error("Failed to cancel vote");
      }
    },
    onSuccess: (_, params) => {
      Sentry.logger.info("Vote cancelled", {
        pin: params.pin,
        userId: params.userId,
        userName: params.userName,
        roundId: params.roundId,
        pickId: params.pickId,
      });
      queryClient.invalidateQueries({ queryKey: pickQueryKey(params.pickId) });
    },
  });
}
