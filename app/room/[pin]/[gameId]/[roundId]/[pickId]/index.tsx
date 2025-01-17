import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { usePick, useRoom } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const [isVoteValidated, setIsVoteValidated] = useState(false);

  function handleVote(guessId: string) {
    setIsVoteValidated(true);
    socket.emit("vote", {
      guessId,
      userId: user.id,
      pickId,
      pin,
    });
  }

  function handleCancelVote() {
    socket.emit("cancelVote", {
      pickId,
      userId: user.id,
    });
  }

  useEffect(() => {
    socket.on("voteValidated", ({ pickId }) => {
      if (pickId) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`);
      } else {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/reveal`);
      }
    });
    socket.on("voteCanceled", () => {
      setIsVoteValidated(false);
    });

    return () => {
      socket.off("voteValidated");
      socket.off("voteCanceled");
    };
  }, []);

  if (isPickLoading || !pick) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title="Listen and Vote !">
      <Text className="text-white text-9xl">{pick.track.title}</Text>
      {room?.users.map((player, index) => (
        <View
          key={index}
          className="flex-row items-center w-full gap-5 py-5 justify-evenly"
        >
          <Text className="text-lg text-white">{index}</Text>
          <Text className="text-lg text-white" key={index}>
            {player.name}
          </Text>
          {!isVoteValidated && (
            <Pressable
              className="p-5 bg-white rounded-lg"
              onPress={() => handleVote(player.id)}
            >
              <Text>Vote</Text>
            </Pressable>
          )}
        </View>
      ))}
      {isVoteValidated && (
        <View className="flex-col items-stretch gap-2">
          <Text className="text-xl text-white">
            Waiting for other players...
          </Text>
          <Button text="Cancel" onPress={handleCancelVote} />
        </View>
      )}
    </Container>
  );
}
