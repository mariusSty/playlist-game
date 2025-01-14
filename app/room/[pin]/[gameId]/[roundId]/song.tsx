import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGame } from "@/hooks/useGame";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

export default function Song() {
  const [song, setSong] = useState("");
  const { pin, gameId, roundId } = useLocalSearchParams();
  const { game, isGameLoading, mutateGame } = useGame(gameId.toString());
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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

    return () => {
      socket.off("songValidated");
    };
  }, []);

  function handleValidSong() {
    setIsButtonDisabled(true);
    socket.emit("validSong", {
      song,
      roundId,
      userId: user.id,
      pin,
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
        />
      </View>
      <View>
        {isButtonDisabled ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Button text="Valid song" onPress={handleValidSong} />
        )}
      </View>
    </Container>
  );
}
