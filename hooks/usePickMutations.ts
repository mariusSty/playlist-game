import { Track } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

type ValidatePickParams = {
  pin: string;
  roundId: string;
  userId: string;
  track: Track;
};

type CancelPickParams = {
  pin: string;
  roundId: string;
  userId: string;
};

export function useValidatePick() {
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
  });
}

export function useCancelPick() {
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
  });
}

type VoteParams = {
  pin: string;
  pickId: string;
  guessId: string;
  userId: string;
};

type CancelVoteParams = {
  pin: string;
  pickId: string;
  userId: string;
};

export function useVote() {
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
  });
}

export function useCancelVote() {
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
  });
}
