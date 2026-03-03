import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ThemedTextInput } from "@/components/TextInput";
import { useMusicApiSearch } from "@/hooks/usePick";
import { useCancelPick, useValidatePick } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { useRound } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { Track } from "@/types/room";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const [search, setSearch] = useState("");
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const [usersValidated, setUsersValidated] = useState<string[]>([]);
  const { room } = useRoom(pin);
  const { round, isRoundLoading } = useRound(roundId);
  const validatePick = useValidatePick();
  const cancelPick = useCancelPick();

  const { tracks = [], isTracksLoading } = useMusicApiSearch(
    isTrackSelected ? null : search,
  );

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    function onPickUpdated({
      users,
      firstPickId,
    }: {
      users: string[];
      firstPickId?: string;
    }) {
      setUsersValidated(users);

      if (firstPickId) {
        router.replace(`/room/${pin}/${gameId}/${roundId}/${firstPickId}`);
        return;
      }

      if (!users.includes(user.id)) {
        setIsTrackSelected(false);
        setSearch("");
      }
    }

    socket.on("pick:updated", onPickUpdated);

    return () => {
      socket.off("pick:updated", onPickUpdated);
    };
  }, [pin, gameId, roundId, room, user.id]);

  async function handleSelectTrack(track: Track) {
    setIsTrackSelected(true);
    setSearch(track.title + " - " + track.artist);
    try {
      await validatePick.mutateAsync({
        pin,
        roundId,
        userId: user.id,
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          previewUrl: track.previewUrl,
        },
      });
    } catch (error) {
      console.error(error);
      setIsTrackSelected(false);
      setSearch("");
    }
  }

  async function handleCancelSong() {
    try {
      await cancelPick.mutateAsync({
        pin,
        roundId,
        userId: user.id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const translatedTheme = i18n.t(`themePage.themes.${round?.theme}`);

  if (isRoundLoading || !round) {
    return (
      <Container title={i18n.t("pickPage.title", { theme: "" })}>
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("pickPage.title", { theme: translatedTheme })}>
      <View className="w-full gap-10">
        <View className="w-full gap-2">
          {isTrackSelected ? (
            <>
              <Text className="text-xl dark:text-white">
                {i18n.t("pickPage.yourSong")}
              </Text>
              <Text className="text-xl dark:text-white">{search}</Text>
              <Button
                text={i18n.t("pickPage.cancelButton")}
                onPress={handleCancelSong}
                disabled={cancelPick.isPending}
              />
            </>
          ) : (
            <>
              <Text className="text-xl font-bold dark:text-white">
                {i18n.t("pickPage.chooseSong")}
              </Text>
              <ThemedTextInput value={search} onChangeText={setSearch} />
            </>
          )}
        </View>
      </View>
      <View className="flex-1">
        {isTracksLoading ? (
          <ActivityIndicator
            size="large"
            className="my-auto text-black dark:text-white"
          />
        ) : (
          <ScrollView className="gap-4 py-2">
            <View className="flex-1 gap-2">
              {tracks?.map((track) => (
                <Button
                  key={track.id}
                  text={track.title + " - " + track.artist}
                  onPress={() => handleSelectTrack(track)}
                  classNames="w-full"
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      <View className="w-full gap-2">
        <View className="flex-row gap-2">
          <Text className="text-xl dark:text-white">
            {i18n.t("pickPage.notChosen")}
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
            {i18n.t("pickPage.alreadyChosen")}
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
