import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { useFinishGame } from "@/hooks/useGameMutations";
import { useRound } from "@/hooks/useRound";
import { useNextRound } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { CircleCheck, CircleX } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Reveal() {
  const { roundId, pin, gameId } = useLocalSearchParams();
  const { round, isRoundLoading } = useRound(roundId.toString());
  const user = useUserStore((state) => state.user);
  const nextRound = useNextRound();
  const finishGame = useFinishGame();

  async function handleNextRound() {
    try {
      await nextRound.mutateAsync({ pin: pin.toString() });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function onRoundCompleted({ nextRoundId }: { nextRoundId?: number }) {
      if (nextRoundId != null) {
        router.replace(`/room/${pin}/${gameId}/${nextRoundId}/theme`);
      } else {
        await finishGame.mutateAsync(gameId.toString());
        router.replace(`/room/${pin}/${gameId}/result`);
      }
    }

    socket.on("round:completed", onRoundCompleted);

    return () => {
      socket.off("round:completed", onRoundCompleted);
    };
  }, [pin, gameId]);

  if (isRoundLoading || !round) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title={i18n.t("revealPage.title")}>
      <View className="gap-4 my-auto">
        {round.picks.map((pick, index) => (
          <View key={index}>
            <Text className="text-xl font-bold dark:text-white">
              {pick.track.title} - {pick.track.artist}
            </Text>
            <View className="flex-row items-center w-full gap-4 py-2">
              <Image
                style={{ width: 50, height: 50, borderRadius: 5 }}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${pick.user.name}`}
                contentFit="cover"
                transition={1000}
              />
              <Text className="text-xl dark:text-white">{pick.user.name}</Text>
              <View className="ml-auto">
                {pick.votes.find((vote) => vote.guessUser.id === user.id)
                  ?.guessedUser.id === pick.user.id ? (
                  <CircleCheck color="green" size={32} />
                ) : (
                  <CircleX color="red" size={32} />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
      {round.themeMaster.id === user.id && (
        <Button
          text={i18n.t("revealPage.nextRoundButton")}
          activeText={i18n.t("revealPage.nextRoundLoading")}
          onPress={handleNextRound}
          isPending={nextRound.isPending}
        />
      )}
    </Container>
  );
}
