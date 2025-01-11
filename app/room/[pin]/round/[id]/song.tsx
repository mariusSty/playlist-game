import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGame, useRoom } from "@/hooks/useGame";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function Song() {
  const [song, setSong] = useState("");
  const { pin, id } = useLocalSearchParams();
  const { game, isGameLoading, mutate } = useGame(pin.toString());
  const { room } = useRoom(pin.toString());
  const { user } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [])
  );

  useEffect(() => {
    socket.on("songValidated", (data) => {
      if (room?.users.length === data.picks) {
        router.navigate(`/room/${pin}/round/${id}/vote`);
      }
    });

    return () => {
      socket.off("songValidated");
    };
  }, []);

  function handleValidSong() {
    socket.emit("validSong", {
      song,
      roundId: id,
      userId: user.id,
    });
  }

  if (isGameLoading || !game) return;

  const title = `Theme is ${getCurrentRound(game, Number(id))?.theme || "..."}`;

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
        <Button text="Valid song" onPress={handleValidSong} />
      </View>
    </Container>
  );
}
