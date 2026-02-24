import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ThemedTextInput } from "@/components/TextInput";
import { useGame } from "@/hooks/useGame";
import { useMusicApiSearch } from "@/hooks/usePick";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import { Track } from "@/types/room";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const [usersValidated, setUsersValidated] = useState<string[]>([]);
  const { game, isGameLoading, mutateGame } = useGame(gameId.toString());
  const { room } = useRoom(pin.toString());
  const { tracks = [], isTracksLoading } = useMusicApiSearch(
    isTrackSelected ? null : search,
  );

  const user = useUserStore((state) => state.user);

  useFocusEffect(() => {
    mutateGame();
  });

  useEffect(() => {
    socket.on("allSongsValidated", ({ pickId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`);
      }
    });
    socket.on("songValidated", ({ pin: pinFromSocket, users }) => {
      if (pinFromSocket === pin) {
        setUsersValidated(users);
      }
    });
    socket.on("songCanceled", ({ pin: pinFromSocket, users }) => {
      if (pinFromSocket === pin) {
        setUsersValidated(users);
        setIsTrackSelected(false);
        setSearch("");
      }
    });

    return () => {
      socket.off("allSongsValidated");
      socket.off("songValidated");
      socket.off("songCanceled");
    };
  }, []);

  function handleSelectTrack(track: Track) {
    setIsTrackSelected(true);
    setSearch(track.title + " - " + track.artist);
    socket.emit("validSong", {
      track: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        previewUrl: track.previewUrl,
      },
      roundId,
      userId: user.id,
      pin,
    });
  }

  function handleCancelSong() {
    socket.emit("cancelSong", {
      roundId,
      userId: user.id,
      pin,
    });
  }

  if (isGameLoading || !game) return;

  const currentTheme = getCurrentRound(game, Number(roundId))?.theme;
  const translatedTheme = i18n.t(`themePage.themes.${currentTheme}`);

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
