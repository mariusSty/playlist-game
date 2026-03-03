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
