import { Game } from "@/types/room";

export function getCurrentRound(game: Game, currentRoundId: number) {
  return game.rounds.find((round) => round.id === currentRoundId);
}
