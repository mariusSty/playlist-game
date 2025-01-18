import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { usePick, useRoom } from "@/hooks/useGame";
import { socket } from "@/utils/server";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const [isVoteValidated, setIsVoteValidated] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

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

  async function handlePlayPreview() {
    if (pick) {
      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: pick.track.previewUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      await newSound.playAsync();
    }
  }

  useEffect(() => {
    socket.on("voteValidated", ({ pickId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        if (pickId) {
          router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`);
        } else {
          router.navigate(`/room/${pin}/${gameId}/${roundId}/reveal`);
        }
      }
    });
    socket.on("voteCanceled", ({ pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        setIsVoteValidated(false);
      }
    });

    return () => {
      socket.off("voteValidated");
      socket.off("voteCanceled");
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (isPickLoading || !pick) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title="Listen and Vote !">
      <Button text="Play" onPress={handlePlayPreview} />
      {room?.users.map((player, index) => (
        <View
          key={player.id}
          className="flex-row items-center w-full gap-5 py-5 justify-evenly"
        >
          <Text className="text-lg text-white">{player.name}</Text>
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
