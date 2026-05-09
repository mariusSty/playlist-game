import { Round } from "@/types/room";

export function computeReveal(round: Round, userId: string) {
  const myPick = round.picks.find((p) => p.user.id === userId);

  const otherPicks = round.picks
    .filter((p) => p.user.id !== userId)
    .map((pick) => {
      const myVote = pick.votes.find((v) => v.guessUser.id === userId);
      return {
        pick,
        myVote,
        isCorrect: myVote?.guessedUser.id === pick.user.id,
      };
    });

  const score = round.picks.reduce((acc, pick) => {
    const myVote = pick.votes.find((v) => v.guessUser.id === userId);
    return myVote?.guessedUser.id === pick.user.id ? acc + 1 : acc;
  }, 0);

  return { myPick, otherPicks, score };
}
