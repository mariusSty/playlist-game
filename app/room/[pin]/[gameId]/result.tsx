import Container from "@/components/Container";
import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";

export default function Result() {
  const { pin } = useLocalSearchParams();

  return (
    <Container title="End of the game">
      <View>
        <Button
          title="Go to room"
          onPress={() => router.navigate(`/room/${pin}`)}
        />
      </View>
    </Container>
  );
}
