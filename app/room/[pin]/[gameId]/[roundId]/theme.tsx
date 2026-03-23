import { Avatar } from "@/components/Avatar";
import Container from "@/components/Container";
import { getRandomThemes } from "@/constants/theme";
import { useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
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

  function handleChoose(theme: string) {
    pickTheme.mutate({
      roundId,
      theme,
      userId: user.id,
      userName: user.name,
      pin,
    });
  }

  if (isRoundLoading || !round || !round.themeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View>
          <ActivityIndicator size="large" />
        </View>
      </Container>
    );
  }

  const isThemeMaster = round.themeMaster.id === user.id;

  if (isThemeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <Text className="py-8 text-xl text-foreground">
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
              isDisabled={
                pickTheme.isPending && pickTheme.variables?.theme !== theme
              }
            >
              <Button.Label>
                {pickTheme.isPending && pickTheme.variables?.theme === theme
                  ? i18n.t("themePage.choosingPending")
                  : i18n.t(`themePage.themes.${theme}`)}
              </Button.Label>
            </Button>
          ))}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="items-center py-8 gap-y-2">
        <Avatar name={round.themeMaster.name} />
        <Text className="text-xl font-bold text-foreground">
          {i18n.t("themePage.waiting", {
            name: round.themeMaster.name,
          })}
        </Text>
        <Text className="text-lg text-foreground">
          {i18n.t("themePage.waitingSubtitle")}
        </Text>
      </View>
    </Container>
  );
}
