import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useRound } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";

export default function Reveal() {
  const { roundId, pin } = useLocalSearchParams();
  const { round, isRoundLoading } = useRound(roundId.toString());
  const { user } = useContext(UserContext);

  function handleNextRound() {
    socket.emit("nextRound", { pin });
  }

  useEffect(() => {
    socket.on("newRound", ({ roundId }) => {
      router.navigate(`/room/${pin}/${roundId}/theme`);
    });

    socket.on("goToResult", () => {
      router.navigate(`/room/${pin}/result`);
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
      {round.picks.map((pick, index) => (
        <View key={index}>
          <Text className="text-xl text-white">{pick.song}</Text>
          {pick.votes.map((vote, index) => (
            <Text key={index} className="text-white">
              {vote.guessUser.name} guessed {vote.guessedUser.name}
            </Text>
          ))}
        </View>
      ))}
      {round.themeMaster.id === user.id && (
        <Button text="Next round" onPress={handleNextRound} />
      )}
    </Container>
  );
}
