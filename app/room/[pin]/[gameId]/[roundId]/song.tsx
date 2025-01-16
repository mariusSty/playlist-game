import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGame, useSpotifySearch } from "@/hooks/useGame";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams();
  const [song, setSong] = useState("");
  const [isSongValidated, setIsSongValidated] = useState(false);
  const { game, isGameLoading, mutateGame } = useGame(gameId.toString());
  const { tracks = [] } = useSpotifySearch(song);
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
      setIsSongValidated(false);
      setSong("");
    });

    return () => {
      socket.off("songValidated");
      socket.off("songCanceled");
    };
  }, []);

  function handleValidSong() {
    setIsSongValidated(true);
    socket.emit("validSong", {
      song,
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
        <TextInput
          value={song}
          onChangeText={setSong}
          placeholder="Your song..."
          className="w-full py-3 text-xl text-center text-white border border-white rounded-lg"
          editable={!isSongValidated}
        />
      </View>
      <View>
        {tracks?.map((track) => (
          <View className="flex-row items-center gap-2 px-5" key={track.id}>
            <Text className="text-white">{track.title}</Text>
            <Text className="text-white">{track.artist.join(", ")}</Text>
          </View>
        ))}
      </View>
      <View className="flex-col items-stretch gap-2">
        {isSongValidated ? (
          <>
            <Text className="text-xl text-white">
              Waiting for other players...
            </Text>
            <Button text="Cancel" onPress={handleCancelSong} />
          </>
        ) : (
          <Button text="Valid song" onPress={handleValidSong} />
        )}
      </View>
    </Container>
  );
}
