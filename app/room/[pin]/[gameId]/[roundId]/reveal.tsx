import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useRound } from "@/hooks/useGame";
import { socket } from "@/utils/server";
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
      {round.picks.map((pick, index) => (
        <View key={index}>
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
