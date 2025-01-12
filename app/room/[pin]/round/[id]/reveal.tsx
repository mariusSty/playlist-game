import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useRound } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function Reveal() {
  const { id, pin } = useLocalSearchParams();
  const { round, isRoundLoading } = useRound(id.toString());
  const { user } = useContext(UserContext);

  const handleNextRound = () => {
    socket.emit("nextRound", { id });
  };

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
