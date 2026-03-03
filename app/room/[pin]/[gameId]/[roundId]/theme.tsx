import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { themes } from "@/constants/theme";
import { roundQueryKey, useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function RoundTheme() {
  const [counter, setCounter] = useState(10);
  const user = useUserStore((state) => state.user);
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();

  const { round, isRoundLoading } = useRound(roundId);
  const pickTheme = usePickTheme();
  const queryClient = useQueryClient();

  async function handleChoose(theme: string) {
    try {
      await pickTheme.mutateAsync({
        roundId,
        theme,
        userId: user.id,
        pin,
      });
      await queryClient.invalidateQueries({ queryKey: roundQueryKey(roundId) });
      router.replace(`/room/${pin}/${gameId}/${roundId}/song`);
    } catch (error) {
      console.error(error);
    }
  }

  useFocusEffect(() => {
    const timer = setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        handleChoose(themes[Math.round(Math.random() * themes.length)]);
        clearTimeout(timer);
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

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
        <View className="gap-5">
          <Text className="text-xl dark:text-white">
            {i18n.t("themePage.themeMaster")}
          </Text>
          <Text className="text-center dark:text-white text-9xl">
            {counter}
          </Text>
        </View>
        <View className="items-stretch gap-y-5">
          {themes.map((theme, index) => (
            <Button
              key={index}
              onPress={() => handleChoose(theme)}
              text={i18n.t(`themePage.themes.${theme}`)}
              disabled={pickTheme.isPending}
            />
          ))}
        </View>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="gap-5">
        <Text className="text-xl dark:text-white">
          {i18n.t("themePage.waiting", {
            name: round.themeMaster.name,
          })}
        </Text>
        <Text className="text-center dark:text-white text-9xl">{counter}</Text>
      </View>
    </Container>
  );
}
