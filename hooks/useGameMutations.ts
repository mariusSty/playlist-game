import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

export function useFinishGame() {
  return useMutation({
    mutationFn: async (gameId: string): Promise<{ finished: true }> => {
      const res = await fetch(`${apiUrl}/game/${gameId}/finish`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to finish game");
      }
      return res.json();
    },
  });
}

type StartGameParams = {
  pin: string;
};

type StartGameResponse = {
  roundId: number;
  gameId: number;
};

export function useStartGame() {
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
  });
}
