import { ThemeLoading } from "@/components/ThemeLoading";
import { ThemePicker } from "@/components/ThemePicker";
import { ThemeWaiting } from "@/components/ThemeWaiting";
import { useRound } from "@/hooks/useRound";
import { useThemes } from "@/hooks/useThemes";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function RoundTheme() {
  const user = useUserStore((state) => state.user);
  const { pin, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const { round, isRoundLoading } = useRound(roundId);
  const { themes, isThemesLoading } = useThemes();

  const screen = (
    <Stack.Screen options={{ title: i18n.t("themePage.title") }} />
  );

  if (
    isRoundLoading ||
    !round ||
    !round.themeMaster ||
    isThemesLoading ||
    !themes
  ) {
    return (
      <View className="flex-1 p-8 justify-around">
        {screen}
        <ThemeLoading />
      </View>
    );
  }

  if (round.themeMaster.id !== user.id) {
    return (
      <View className="flex-1 p-8 justify-around">
        {screen}
        <ThemeWaiting name={round.themeMaster.name} />
      </View>
    );
  }

  return (
    <View className="flex-1 p-8 justify-around">
      {screen}
      <ThemePicker
        themes={themes}
        pin={pin}
        roundId={roundId}
        userId={user.id}
        userName={user.name}
      />
    </View>
  );
}
