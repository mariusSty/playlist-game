import Container from "@/components/Container";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Result() {
  return (
    <Container title="Results">
      <View>
        <Text>Player 1: 10 points</Text>
        <Text>Player 2: 5 points</Text>
        <Text>Player 3: 0 points</Text>
      </View>
      <Link href="/room/id/rank" asChild>
        <Pressable>
          <Text>Final results</Text>
        </Pressable>
      </Link>
    </Container>
  );
}
