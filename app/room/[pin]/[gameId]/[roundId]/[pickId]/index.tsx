import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { usePick } from "@/hooks/usePick";
import { useRoom } from "@/hooks/useRoom";
import { Pick } from "@/types/room";
import { socket } from "@/utils/server";
import { FontAwesome6 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const [isVoteValidated, setIsVoteValidated] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  function handlePlay() {
    if (!sound) return;
    sound.playAsync();
  }

  function handleStartFromBegin() {
    if (!sound) return;
    sound.playFromPositionAsync(0);
  }

  function handlePause() {
    if (!sound) return;
    sound.pauseAsync();
  }

  async function loadSound(pick: Pick) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      { uri: pick.track.previewUrl },
      { shouldPlay: false },
      (status) => {
        if (status.isLoaded) {
          if (status.isPlaying) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      }
    );

    setSound(sound);
  }

  useFocusEffect(
    useCallback(() => {
      if (pick && !sound) {
        loadSound(pick);
      }

      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [sound, pick])
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
      {!sound ? (
        <ActivityIndicator
          size="large"
          className="my-auto text-black dark:text-white"
        />
      ) : (
        <View className="flex-row items-center justify-center gap-5">
          <Pressable
            onPress={isPlaying ? handlePause : handlePlay}
            className="w-auto p-5 bg-black rounded-lg dark:bg-white"
          >
            <Text className="text-xl font-bold text-center text-white dark:text-black">
              {isPlaying ? (
                <FontAwesome6 name="pause" size={24} />
              ) : (
                <FontAwesome6 name="play" size={24} />
              )}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleStartFromBegin}
            className="w-auto p-5 bg-black rounded-lg dark:bg-white"
          >
            <Text className="text-xl font-bold text-center text-white dark:text-black">
              <FontAwesome6 name="rotate-left" size={24} />
            </Text>
          </Pressable>
        </View>
      )}
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
