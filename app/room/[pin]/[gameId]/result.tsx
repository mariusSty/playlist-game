import { Avatar } from "@/components/Avatar";
import { useResult } from "@/hooks/useGame";
import { useFinishGame } from "@/hooks/useGameMutations";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { Text, View } from "react-native";

export default function Result() {
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

  return (
    <View className="flex-1 p-8 justify-around">
      <Stack.Screen options={{ title: i18n.t("resultPage.title") }} />
      <View className="gap-4 my-auto">
        {result
          .sort((a, b) => b.score - a.score)
          .map((result, index) => (
            <View
              key={result.user.id}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-xl text-foreground">{index + 1}</Text>
                <Avatar name={result.user.name} />
                <Text className="text-xl text-foreground">
                  {result.user.name}
                </Text>
              </View>
              <Text className="text-xl text-foreground">
                {result.score} {result.score <= 1 ? "point" : "points"}
              </Text>
            </View>
          ))}
      </View>
      {room?.host.id === userId && (
        <Button onPress={handleFinishGame}>
          <Button.Label>{i18n.t("resultPage.exitButton")}</Button.Label>
        </Button>
      )}
    </View>
  );
}
