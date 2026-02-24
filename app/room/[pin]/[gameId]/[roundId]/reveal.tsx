import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { useRound } from "@/hooks/useRound";
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

  function handleNextRound() {
    socket.emit("nextRound", { pin, gameId });
  }

  useEffect(() => {
    function onNewRound({ roundId }: { roundId: string }) {
      router.replace(`/room/${pin}/${gameId}/${roundId}/theme`);
    }

    function onGoToResult() {
      router.replace(`/room/${pin}/${gameId}/result`);
    }

    socket.on("newRound", onNewRound);
    socket.on("goToResult", onGoToResult);

    return () => {
      socket.off("newRound", onNewRound);
      socket.off("goToResult", onGoToResult);
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
          onPress={handleNextRound}
        />
      )}
    </Container>
  );
}
