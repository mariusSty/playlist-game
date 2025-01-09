import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { Game } from "@/types/room";
import { apiUrl, fetcher, socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import useSWR from "swr";

export default function Song() {
  const [song, setSong] = useState("");
  const { pin, id } = useLocalSearchParams();
  const {
    data: game,
    isLoading,
    mutate,
  } = useSWR<Game>(`${apiUrl}/game/${pin}`, fetcher);
  const { user } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [])
  );

  function handleValidSong() {
    socket.emit("validSong", {
      song: {
        title: song,
        artist: "",
        url: "",
      },
      roundId: game?.actualRound?.id,
      userId: user.id,
    });
  }

  useEffect(() => {
    socket.on("nextRound", () => {
      router.navigate(`/room/${pin}/round/${id}/vote`);
    });
  }, []);

  if (isLoading) return;
  console.log(game);
  const title = `Theme is ${game?.actualRound?.theme?.description || "..."}`;

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
