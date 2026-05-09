import { Result } from "@/types/room";
import i18n from "@/utils/translation";

export type RankedResult = Result & { place: number };

export function rankResults(results: Result[], userId: string) {
  const sorted = [...results].sort((a, b) => b.score - a.score);

  const ranked: RankedResult[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const place =
      i > 0 && sorted[i - 1].score === entry.score
        ? ranked[i - 1].place
        : i + 1;
    ranked.push({ ...entry, place });
  }

  return {
    ranked,
    currentPlayer: ranked.find((r) => r.user.id === userId),
    firsts: ranked.filter((r) => r.place === 1),
    seconds: ranked.filter((r) => r.place === 2),
    thirds: ranked.filter((r) => r.place === 3),
    others: ranked.filter((r) => r.place > 3),
  };
}

export function placeMessage(place: number) {
  if (place === 1) return i18n.t("resultPage.messageFirst");
  if (place === 2) return i18n.t("resultPage.messageSecond");
  if (place === 3) return i18n.t("resultPage.messageThird");
  return i18n.t("resultPage.messageOther", { place });
}

export function pointsLabel(score: number) {
  return score <= 1 ? "point" : "points";
}

export function formatPoints(score: number) {
  return `${score} ${pointsLabel(score)}`;
}
