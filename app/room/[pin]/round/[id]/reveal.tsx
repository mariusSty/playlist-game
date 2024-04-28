import Container from "@/components/Container";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Reveal() {
  return (
    <Container title="Song reveal">
      <View>
        <Text className="text-white text-xl">1. Song - Artist</Text>
      </View>
      <View className="gap-5">
        <Text className="text-white text-xl">Choose by</Text>
        <Text className="text-white text-xl">Player 1</Text>
        <Link asChild href="/room/id/round/id/result">
          <Pressable>
            <Text className="text-white text-xl">+10 points</Text>
          </Pressable>
        </Link>
      </View>
    </Container>
  );
}
