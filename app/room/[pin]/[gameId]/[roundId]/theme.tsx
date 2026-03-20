import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { getRandomThemes } from "@/constants/theme";
import { useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function RoundTheme() {
  const user = useUserStore((state) => state.user);
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();

  const { round, isRoundLoading } = useRound(roundId);
  const pickTheme = usePickTheme();
  const themes = useMemo(() => getRandomThemes(5), []);

  async function handleChoose(theme: string) {
    await pickTheme.mutate(
      {
        roundId,
        theme,
        userId: user.id,
        pin,
      },
      {
        onSuccess: () => {
          Sentry.logger.info("Theme picked", {
            pin,
            userId: user.id,
            userName: user.name,
            theme,
          });
        },
      },
    );
  }

  if (isRoundLoading || !round || !round.themeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </Container>
    );
  }

  const isThemeMaster = round.themeMaster.id === user.id;

  if (isThemeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <Text className="py-8 text-xl dark:text-white">
          {i18n.t("themePage.themeMaster")}
        </Text>
        <ScrollView
          className="flex-1"
          contentContainerClassName="items-stretch gap-y-5"
          style={{ overflow: "visible" }}
        >
          {themes.map((theme, index) => (
            <Button
              key={index}
              onPress={() => handleChoose(theme)}
              text={i18n.t(`themePage.themes.${theme}`)}
              isPending={
                pickTheme.isPending && pickTheme.variables?.theme === theme
              }
              disabled={
                pickTheme.isPending && pickTheme.variables?.theme !== theme
              }
            />
          ))}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="items-center py-8 gap-y-2">
        <Avatar name={round.themeMaster.name} />
        <Text className="text-xl font-bold dark:text-white">
          {i18n.t("themePage.waiting", {
            name: round.themeMaster.name,
          })}
        </Text>
        <Text className="text-lg dark:text-white/70">
          {i18n.t("themePage.waitingSubtitle")}
        </Text>
      </View>
    </Container>
  );
}
