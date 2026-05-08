import { Avatar } from "@/components/Avatar";
import { PodiumColumn } from "@/components/PodiumColumn";
import { useResult } from "@/hooks/useGame";
import { useFinishGame } from "@/hooks/useGameMutations";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import { formatPoints, placeMessage, rankResults } from "@/utils/result";
import i18n from "@/utils/translation";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function ResultPage() {
  const { pin, gameId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
  }>();
  const { room } = useRoom(pin);
  const { result = [] } = useResult(gameId);
  const finishGame = useFinishGame();
  const userId = useUserStore((state) => state.user.id);

  function handleFinishGame() {
    finishGame.mutate({ gameId, userId });
  }

  const { currentPlayer, first, second, third, others } = rankResults(
    result,
    userId,
  );

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: i18n.t("resultPage.title") }} />
      <ScrollView contentContainerClassName="p-6 gap-8">
        {currentPlayer && (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="bg-foreground/10 border border-foreground/20 rounded-3xl p-6 items-center gap-3"
          >
            <Text className="text-2xl font-bold text-foreground text-center">
              {placeMessage(currentPlayer.place)}
            </Text>
            <Avatar name={currentPlayer.user.name} size="large" />
            <Text
              className="text-xl font-semibold text-foreground"
              numberOfLines={1}
            >
              {currentPlayer.user.name}
            </Text>
            <Text className="text-3xl font-bold text-foreground">
              {formatPoints(currentPlayer.score)}
            </Text>
          </Animated.View>
        )}

        {first && second && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(150)}
            className="flex-row items-end justify-center gap-2 px-2"
          >
            <PodiumColumn result={second} place={2} />
            <PodiumColumn result={first} place={1} />
            {third && <PodiumColumn result={third} place={3} />}
          </Animated.View>
        )}

        {others.length > 0 && (
          <View className="gap-3">
            {others.map((entry, index) => (
              <Animated.View
                key={entry.user.id}
                entering={FadeIn.duration(300).delay(300 + index * 60)}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-4 flex-1">
                  <Text className="text-xl text-foreground w-6">
                    {entry.place}
                  </Text>
                  <Avatar name={entry.user.name} />
                  <Text
                    className="text-xl text-foreground flex-shrink"
                    numberOfLines={1}
                  >
                    {entry.user.name}
                  </Text>
                </View>
                <Text className="text-xl text-foreground">
                  {formatPoints(entry.score)}
                </Text>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {room?.host.id === userId && (
        <View className="p-6 pt-2">
          <Button onPress={handleFinishGame}>
            <Button.Label>{i18n.t("resultPage.exitButton")}</Button.Label>
          </Button>
        </View>
      )}
    </View>
  );
}
