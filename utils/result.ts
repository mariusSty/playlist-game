import { Result } from "@/types/room";
import i18n from "@/utils/translation";

export type RankedResult = Result & { place: number };

export function rankResults(results: Result[], userId: string) {
  const ranked: RankedResult[] = [...results]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, place: index + 1 }));

  return {
    ranked,
    currentPlayer: ranked.find((r) => r.user.id === userId),
    first: ranked.find((r) => r.place === 1),
    second: ranked.find((r) => r.place === 2),
    third: ranked.find((r) => r.place === 3),
    others: ranked.slice(3),
  };
}

export function placeMessage(place: number) {
  if (place === 1) return i18n.t("resultPage.messageFirst");
  if (place === 2) return i18n.t("resultPage.messageSecond");
  if (place === 3) return i18n.t("resultPage.messageThird");
  return i18n.t("resultPage.messageOther", { place });
}

export function formatPoints(score: number) {
  return `${score} ${score <= 1 ? "point" : "points"}`;
}
