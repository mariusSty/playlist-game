import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGame, useMusicApiSearch } from "@/hooks/useGame";
import { Track } from "@/types/room";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

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
    socket.on("songValidated", ({ pickId }) =>
      router.navigate(`/room/${pin}/${gameId}/${roundId}/${pickId}`)
    );
    socket.on("songCanceled", () => {
      setIsTrackSelected(false);
      setSearch("");
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

  const title = `Theme is ${
    getCurrentRound(game, Number(roundId))?.theme || "..."
  }`;

  return (
    <Container title={title}>
      <View className="w-full gap-10 px-5">
        <Text className="text-xl text-white">Choose the song</Text>
        {isTrackSelected ? (
          <View className="flex-row items-center gap-2 px-5">
            <Text className="text-xl text-white">{search}</Text>
            <Button text="Cancel" onPress={handleCancelSong} />
          </View>
        ) : (
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Your song..."
            className="w-full py-3 text-xl text-center text-white border border-white rounded-lg"
          />
        )}
      </View>
      <View>
        {tracks?.map((track) => (
          <View className="flex-row items-center gap-2 px-5" key={track.id}>
            <Button
              text={track.title + " - " + track.artist}
              onPress={() => handleSelectTrack(track)}
            />
          </View>
        ))}
      </View>
    </Container>
  );
}
