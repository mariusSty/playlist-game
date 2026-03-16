import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { getRandomThemes } from "@/constants/theme";
import { roundQueryKey, useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
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
  const queryClient = useQueryClient();
  const themes = useMemo(() => getRandomThemes(5), []);

  async function handleChoose(theme: string) {
    try {
      await pickTheme.mutateAsync({
        roundId,
        theme,
        userId: user.id,
        pin,
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function onThemeUpdated() {
      await queryClient.invalidateQueries({ queryKey: roundQueryKey(roundId) });
      router.replace(`/room/${pin}/${gameId}/${roundId}/song`);
    }

    socket.on("round:themeUpdated", onThemeUpdated);

    return () => {
      socket.off("round:themeUpdated", onThemeUpdated);
    };
  }, [pin, gameId, roundId]);

  if (isRoundLoading || !round) {
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
        >
          {themes.map((theme, index) => (
            <Button
              key={index}
              onPress={() => handleChoose(theme)}
              text={i18n.t(`themePage.themes.${theme}`)}
              disabled={pickTheme.isPending}
            />
          ))}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="items-center py-8 gap-y-2">
        <Image
          style={{ width: 50, height: 50, borderRadius: 5 }}
          source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${round.themeMaster.name}`}
          contentFit="cover"
          transition={1000}
        />
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
