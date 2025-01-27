import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useRound } from "@/hooks/useRound";
import { socket } from "@/utils/server";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";

export default function Reveal() {
  const { roundId, pin, gameId } = useLocalSearchParams();
  const { round, isRoundLoading } = useRound(roundId.toString());
  const { user } = useContext(UserContext);

  function handleNextRound() {
    socket.emit("nextRound", { pin });
  }

  useEffect(() => {
    socket.on("newRound", ({ roundId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/theme`);
      }
    });

    socket.on("goToResult", ({ pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/result`);
      }
    });

    return () => {
      socket.off("newRound");
      socket.off("goToResult");
    };
  }, []);

  if (isRoundLoading || !round) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title="Round reveal">
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
              <Text className="ml-auto text-xl dark:text-white">
                {pick.votes.find((vote) => vote.guessUser.id === user.id)
                  ?.guessedUser.id === pick.user.id ? (
                  <Entypo name="check" color="green" size={32} />
                ) : (
                  <Entypo name="cross" color="red" size={32} />
                )}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {round.themeMaster.id === user.id && (
        <Button text="Next round" onPress={handleNextRound} />
      )}
    </Container>
  );
}
