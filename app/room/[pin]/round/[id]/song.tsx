import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function Song() {
  const [song, setSong] = useState("");

  return (
    <Container title="Theme is...">
      <View className="w-full px-5 gap-10">
        <Text className="text-white text-xl">Choose the song</Text>
        <TextInput
          value={song}
          onChangeText={setSong}
          placeholder="Your song..."
          className="border border-white w-full rounded-lg py-3 text-xl text-white text-center"
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
