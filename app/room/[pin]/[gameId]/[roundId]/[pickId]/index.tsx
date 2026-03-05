import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { useColorScheme } from "@/components/useColorScheme";
import { usePick } from "@/hooks/usePick";
import { useCancelVote, useVote } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { roundQueryKey } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pause, Play, RotateCcw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

setAudioModeAsync({ playsInSilentMode: true });

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);
  const colorScheme = useColorScheme();
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const voteMutation = useVote();
  const cancelVoteMutation = useCancelVote();
  const queryClient = useQueryClient();
  const [usersValidated, setUsersValidated] = useState<string[]>([]);

  const hasVoted = usersValidated.includes(user.id);
  const isMutating = voteMutation.isPending || cancelVoteMutation.isPending;

  const audioSource = pick?.track?.previewUrl ?? null;

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;

  function handleVote(guessId: string) {
    voteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      guessId,
      userId: user.id,
    });
  }

  function handleCancelVote() {
    cancelVoteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      userId: user.id,
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
    async function onVoteUpdated({
      users,
      nextPickId,
    }: {
      users: string[];
      nextPickId: string | null;
    }) {
      setUsersValidated(users);

      // All users have voted → navigate to next pick or reveal
      if (nextPickId === null) {
        await queryClient.invalidateQueries({
          queryKey: roundQueryKey(roundId.toString()),
        });
        router.replace(`/room/${pin}/${gameId}/${roundId}/reveal`);
      }
      if (nextPickId) {
        router.replace(`/room/${pin}/${gameId}/${roundId}/${nextPickId}`);
      }
    }

    socket.on("vote:updated", onVoteUpdated);

    return () => {
      socket.off("vote:updated", onVoteUpdated);
    };
  }, [pin, gameId, roundId]);

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
            {isPlaying ? (
              <Pause
                size={24}
                color={colorScheme === "dark" ? "black" : "white"}
              />
            ) : (
              <Play
                size={24}
                color={colorScheme === "dark" ? "black" : "white"}
              />
            )}
          </Pressable>
          <Pressable
            onPress={handleStartFromBegin}
            className="w-auto p-5 bg-black rounded-lg dark:bg-white"
          >
            <RotateCcw
              size={24}
              color={colorScheme === "dark" ? "black" : "white"}
            />
          </Pressable>
        </View>
      )}
      <View className="justify-center flex-1">
        {hasVoted ? (
          <Button
            text={i18n.t("votePage.cancelButton")}
            onPress={handleCancelVote}
            disabled={isMutating}
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
                <Button
                  text="Vote"
                  onPress={() => handleVote(player.id)}
                  disabled={isMutating}
                />
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
