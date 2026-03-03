import { Round } from "@/types/room";
import { apiUrl } from "@/utils/server";
import { useMutation } from "@tanstack/react-query";

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
