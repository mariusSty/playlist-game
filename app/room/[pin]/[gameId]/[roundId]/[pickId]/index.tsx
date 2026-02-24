import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { usePick } from "@/hooks/usePick";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const [isVoteValidated, setIsVoteValidated] = useState(false);
  const [usersValidated, setUsersValidated] = useState<string[]>([]);

  const audioSource = pick?.track.previewUrl
    ? { uri: pick.track.previewUrl }
    : null;

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;

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
      pin,
    });
  }

  function handlePlay() {
    player.play();
  }

  function handleStartFromBegin() {
    player.seekTo(0);
    player.play();
  }

  function handlePause() {
    player.pause();
  }

  useEffect(() => {
    socket.on("voteValidated", ({ pin: pinFromSocket, users }) => {
      if (pinFromSocket === pin) {
        setUsersValidated(users);
      }
    });
    socket.on("allVotesValidated", ({ pin, pickId }) => {
      if (pickId) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`);
      } else {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/reveal`);
      }
    });
    socket.on("voteCanceled", ({ pin: pinFromSocket, users }) => {
      if (pinFromSocket === pin) {
        setUsersValidated(users);
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
    <Container title={i18n.t("votePage.title")}>
      {!status.isLoaded ? (
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
          <Button
            text={i18n.t("votePage.cancelButton")}
            onPress={handleCancelVote}
          />
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
      <View className="w-full gap-2">
        <View className="flex-row gap-2">
          <Text className="text-xl dark:text-white">
            {i18n.t("votePage.notVoted")}
          </Text>
          {room?.users
            .filter((user) => !usersValidated.includes(user.id))
            .map((user) => (
              <Image
                key={user.id}
                style={{ width: 20, height: 20, borderRadius: 5 }}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
                contentFit="cover"
                transition={1000}
              />
            ))}
        </View>
        <View className="flex-row gap-2">
          <Text className="text-xl dark:text-white">
            {i18n.t("votePage.alreadyVoted")}
          </Text>
          {room?.users
            .filter((user) => usersValidated.includes(user.id))
            .map((user) => (
              <Image
                key={user.id}
                style={{ width: 20, height: 20, borderRadius: 5 }}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
                contentFit="cover"
                transition={1000}
              />
            ))}
        </View>
      </View>
    </Container>
  );
}
