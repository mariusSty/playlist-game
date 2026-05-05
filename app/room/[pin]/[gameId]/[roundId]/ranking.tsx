import { Avatar } from "@/components/Avatar";
import { LoadingButton } from "@/components/LoadingButton";
import { useRoom } from "@/hooks/useRoom";
import { useNextRound } from "@/hooks/useRoundMutations";
import { useStandings } from "@/hooks/useStandings";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Ranking() {
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const { room } = useRoom(pin);
  const { standings, isStandingsLoading } = useStandings(gameId, roundId);
  const user = useUserStore((state) => state.user);
  const nextRound = useNextRound();

  function handleNextRound() {
    nextRound.mutate({
      pin,
      gameId,
      userId: user.id,
      userName: user.name,
      roundId,
    });
  }

  if (isStandingsLoading || !standings) {
    return (
      <View className="flex-1 p-8 justify-around">
        <Stack.Screen options={{ title: i18n.t("rankingPage.title") }} />
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  const sorted = [...standings].sort((a, b) => a.place - b.place);

  return (
    <View className="flex-1 p-8 justify-around">
      <Stack.Screen options={{ title: i18n.t("rankingPage.title") }} />
      <View className="gap-4 my-auto">
        {sorted.map((standing, index) => {
          const delta =
            standing.previousPlace === null
              ? null
              : standing.previousPlace - standing.place;

          return (
            <Animated.View
              key={standing.user.id}
              entering={FadeIn.duration(300).delay(index * 60)}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-xl text-foreground w-6">
                  {standing.place}
                </Text>
                <View className="w-10">
                  {delta === null ? (
                    <Text className="text-sm text-foreground opacity-50">
                      {i18n.t("rankingPage.rankSame")}
                    </Text>
                  ) : delta > 0 ? (
                    <Text className="text-sm" style={{ color: "green" }}>
                      {i18n.t("rankingPage.rankUp", { count: delta })}
                    </Text>
                  ) : delta < 0 ? (
                    <Text className="text-sm" style={{ color: "red" }}>
                      {i18n.t("rankingPage.rankDown", { count: -delta })}
                    </Text>
                  ) : (
                    <Text className="text-sm text-foreground opacity-50">
                      {i18n.t("rankingPage.rankSame")}
                    </Text>
                  )}
                </View>
                <Avatar name={standing.user.name} />
                <Text
                  className="text-xl text-foreground flex-shrink"
                  numberOfLines={1}
                >
                  {standing.user.name}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xl font-bold text-foreground">
                  {i18n.t("rankingPage.totalPoints", {
                    count: standing.totalScore,
                  })}
                </Text>
                {standing.roundScore > 0 && (
                  <Text className="text-sm text-foreground opacity-60">
                    {i18n.t("rankingPage.pointsThisRound", {
                      count: standing.roundScore,
                    })}
                  </Text>
                )}
              </View>
            </Animated.View>
          );
        })}
      </View>

      {room?.host.id === user.id && (
        <LoadingButton
          onPress={handleNextRound}
          isLoading={nextRound.isPending}
        >
          <Button.Label>{i18n.t("rankingPage.nextRoundButton")}</Button.Label>
        </LoadingButton>
      )}
    </View>
  );
}
