import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { usePick } from "@/hooks/usePick";
import { useRoom } from "@/hooks/useRoom";
import { socket } from "@/utils/server";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

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
    }
  }

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [sound])
  );

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

  if (isPickLoading || !pick) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title="Listen and Vote !">
      <Button text="Play song" onPress={handlePlayPreview} classNames="mt-8" />
      <View className="justify-center flex-1">
        {isVoteValidated ? (
          <>
            <Text className="my-auto text-xl text-center dark:text-white">
              Waiting for other players...
            </Text>
            <Button text="Cancel my vote" onPress={handleCancelVote} />
          </>
        ) : (
          <>
            {room?.users.map((player) => (
              <View
                key={player.id}
                className="flex-row items-center justify-between w-full py-2"
              >
                <Image
                  style={{ width: 50, height: 50, borderRadius: 5 }}
                  source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${player.name}`}
                  contentFit="cover"
                  transition={1000}
                />
                <Text className="text-lg dark:text-white">{player.name}</Text>
                {!isVoteValidated && (
                  <Button text="Vote" onPress={() => handleVote(player.id)} />
                )}
              </View>
            ))}
          </>
        )}
      </View>
    </Container>
  );
}
