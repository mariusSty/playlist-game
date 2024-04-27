import Container from "@/components/Container";
import { Text, View } from "react-native";

export default function Rank() {
  return (
    <Container title="Ranking">
      <View>
        <Text>Player 1: 10 points</Text>
        <Text>Player 2: 5 points</Text>
        <Text>Player 3: 0 points</Text>
      </View>
    </Container>
  );
}
