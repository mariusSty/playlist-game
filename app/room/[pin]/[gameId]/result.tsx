import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { useResult } from "@/hooks/useGame";
import { useFinishGame } from "@/hooks/useGameMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Result() {
  const { gameId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
  }>();
  const { result, isResultLoading } = useResult(gameId);
  const finishGame = useFinishGame();
  const clearCurrentRoom = useUserStore((state) => state.clearCurrentRoom);

  function handleFinishGame() {
    finishGame.mutate(gameId, {
      onSuccess: () => {
        clearCurrentRoom();
      },
    });
  }

  if (isResultLoading || !result) return <Text>Loading...</Text>;

  return (
    <Container title={i18n.t("resultPage.title")}>
      <View className="gap-4 my-auto">
        {result
          .sort((a, b) => b.score - a.score)
          .map((result, index) => (
            <View
              key={result.user.id}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-xl dark:text-white">{index + 1}</Text>
                <Avatar name={result.user.name} />
                <Text className="text-xl dark:text-white">
                  {result.user.name}
                </Text>
              </View>
              <Text className="text-xl dark:text-white">
                {result.score} {result.score <= 1 ? "point" : "points"}
              </Text>
            </View>
          ))}
      </View>
      <Button
        text={i18n.t("resultPage.exitButton")}
        onPress={handleFinishGame}
      />
    </Container>
  );
}
