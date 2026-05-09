import { LeaveRoomButton } from "@/components/LeaveRoomButton";
import { RoundPhase, RoundStepper } from "@/components/RoundStepper";
import { useGame } from "@/hooks/useGame";
import i18n from "@/utils/translation";
import { useLocalSearchParams, usePathname } from "expo-router";
import { Text, View } from "react-native";

type ParsedRoute = {
  roundId: string | null;
  phase: RoundPhase | null;
  isResult: boolean;
};

function parseRoute(pathname: string): ParsedRoute {
  const segments = pathname.split("/").filter(Boolean);
  const gameIdIndex = segments.findIndex((s) => s === "room") + 2;
  const afterGame = segments.slice(gameIdIndex + 1);

  if (afterGame[0] === "result") {
    return { roundId: null, phase: null, isResult: true };
  }

  const roundId = afterGame[0] ?? null;
  const tail = afterGame[1];

  let phase: RoundPhase | null = null;
  if (tail === "theme") phase = "theme";
  else if (tail === "song") phase = "song";
  else if (tail === "reveal" || tail === "ranking") phase = "reveal";
  else if (tail && /^\d+$/.test(tail)) phase = "vote";

  return { roundId, phase, isResult: false };
}

export function GameHeader() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const pathname = usePathname();
  const { game } = useGame(gameId);

  const { roundId, phase, isResult } = parseRoute(pathname);

  const rounds = game?.rounds ?? [];
  const total = rounds.length;
  const currentRoundId = roundId ? Number(roundId) : null;
  const current =
    currentRoundId !== null && rounds.some((r) => r.id === currentRoundId)
      ? rounds.filter((r) => r.id <= currentRoundId).length
      : null;

  const title = isResult
    ? i18n.t("resultPage.title")
    : phase
      ? i18n.t(`gameHeader.steps.${phase}`)
      : "";

  const counter =
    !isResult && current && total
      ? i18n.t("gameHeader.round", { current, total })
      : null;

  return (
    <View className="bg-background px-4 pt-2 pb-3 gap-3">
      <View className="flex-row items-center gap-3">
        <LeaveRoomButton />
        <Text
          className="flex-1 text-xl font-bold text-foreground"
          numberOfLines={1}
        >
          {title}
        </Text>
        {counter ? (
          <Text className="text-base text-foreground/70">{counter}</Text>
        ) : null}
      </View>
      {!isResult && phase && <RoundStepper currentPhase={phase} />}
    </View>
  );
}
