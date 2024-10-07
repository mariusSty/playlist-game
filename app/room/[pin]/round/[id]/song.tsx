import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Game } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/swr";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import useSWR from "swr";

export default function Song() {
  const [song, setSong] = useState("");
  const { pin } = useLocalSearchParams();
  const { data: game, isLoading } = useSWR<Game>(
    `${apiUrl}/game/${pin}`,
    fetcher
  );

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
        <Link href="/room/id/round/id/vote" asChild>
          <Button text="Valid song" />
        </Link>
      </View>
    </Container>
  );
}
