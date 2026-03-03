import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

type StartGameParams = {
  pin: string;
};

type StartGameResponse = {
  roundId: number;
  gameId: number;
};

export function useStartGame() {
  return useMutation({
    mutationFn: async (params: StartGameParams): Promise<StartGameResponse> => {
      const res = await fetch(`${apiUrl}/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: params.pin }),
      });
      if (!res.ok) {
        throw new Error("Failed to start game");
      }
      return res.json();
    },
  });
}
