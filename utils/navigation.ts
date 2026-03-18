import { GamePhase } from "@/types/room";

export function gamePhaseToRoute(
  pin: string,
  gameId: string,
  phase: GamePhase,
): string {
  switch (phase.phase) {
    case "theme":
      return `/room/${pin}/${gameId}/${phase.roundId}/theme`;
    case "song":
      return `/room/${pin}/${gameId}/${phase.roundId}/song`;
    case "vote":
      return `/room/${pin}/${gameId}/${phase.roundId}/${phase.pickId}`;
    case "reveal":
      return `/room/${pin}/${gameId}/${phase.roundId}/reveal`;
    case "result":
      return `/room/${pin}/${gameId}/result`;
  }
}
