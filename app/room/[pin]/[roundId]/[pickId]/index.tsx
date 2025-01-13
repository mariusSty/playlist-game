import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { usePick, useRoom } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, roundId, pickId } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { room } = useRoom(pin.toString());
  const { pick } = usePick(pickId.toString());

  function handleVote(guessId: string) {
    socket.emit("vote", {
      guessId,
      userId: user.id,
      pickId,
      pin,
    });
  }

  useEffect(() => {
    socket.on("voteValidated", ({ pickId }) => {
      if (pickId) {
        router.navigate(`/room/${pin}/${roundId}/${pickId}`);
      } else {
        router.navigate(`/room/${pin}/${roundId}/reveal`);
      }
    });

    return () => {
      socket.off("voteValidated");
    };
  }, []);

  return (
    <Container title="Listen and Vote !">
      <Text className="text-white text-9xl">{pick?.song}</Text>
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
