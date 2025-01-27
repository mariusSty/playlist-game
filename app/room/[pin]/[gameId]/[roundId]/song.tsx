import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ThemedTextInput } from "@/components/TextInput";
import { UserContext } from "@/contexts/user-context";
import { useGame } from "@/hooks/useGame";
import { useMusicApiSearch } from "@/hooks/usePick";
import { Track } from "@/types/room";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const { game, isGameLoading, mutateGame } = useGame(gameId.toString());
  const { tracks = [] } = useMusicApiSearch(isTrackSelected ? null : search);
  const { user } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      mutateGame();
    }, [])
  );

  useEffect(() => {
    socket.on("songValidated", ({ pickId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`);
      }
    });
    socket.on("songCanceled", ({ pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        setIsTrackSelected(false);
        setSearch("");
      }
    });

    return () => {
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
    });
  }

  if (isGameLoading || !game) return;

  const title = `Theme is "${
    getCurrentRound(game, Number(roundId))?.theme || "..."
  }"`;

  return (
    <Container title={title}>
      <View className="w-full gap-10">
        <View className="w-full gap-2">
          {isTrackSelected ? (
            <>
              <Text className="text-xl dark:text-white">Your song :</Text>
              <Text className="text-xl dark:text-white">{search}</Text>
              <Button text="Cancel" onPress={handleCancelSong} />
            </>
          ) : (
            <>
              <Text className="text-xl font-bold dark:text-white">
                Choose a song
              </Text>
              <ThemedTextInput value={search} onChangeText={setSearch} />
            </>
          )}
        </View>
      </View>
      <View className="flex-1">
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
      </View>
    </Container>
  );
}
