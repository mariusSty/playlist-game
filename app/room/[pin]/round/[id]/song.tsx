import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { Game } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/swr";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { io } from "socket.io-client";
import useSWR from "swr";

const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/rooms`);

export default function Song() {
  const [song, setSong] = useState("");
  const { pin, id } = useLocalSearchParams();
  const { data: game, isLoading } = useSWR<Game>(
    `${apiUrl}/game/${pin}`,
    fetcher
  );
  const { user } = useContext(UserContext);

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
