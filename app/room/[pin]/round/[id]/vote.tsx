import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGameRoom, useGameVotes } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, id } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { room } = useGameRoom(pin.toString());
  const { votes } = useGameVotes(pin.toString());

  function handleVote(guessId: string) {
    socket.emit("vote", { guessId, userId: user.id, roundId: id });
  }

  return (
    <Container title="Listen and Vote !">
      <Text className="text-white text-9xl">{votes?.song}</Text>
      {room?.users.map((player, index) => (
        <View
          key={index}
          className="flex-row items-center w-full gap-5 py-5 justify-evenly"
        >
          <Text className="text-lg text-white">{index}</Text>
          <Text className="text-lg text-white" key={index}>
            {player.name}
          </Text>
          <Pressable
            className="p-5 bg-white rounded-lg"
            onPress={() => handleVote(player.id)}
          >
            <Text>Vote</Text>
          </Pressable>
        </View>
      ))}
    </Container>
  );
}
