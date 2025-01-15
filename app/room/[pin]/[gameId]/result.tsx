import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useResult } from "@/hooks/useGame";
import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Button, Text, View } from "react-native";

export default function Result() {
  const { pin, gameId } = useLocalSearchParams();
  const { result, isResultLoading } = useResult(gameId.toString());
  const { user } = useContext(UserContext);

  if (isResultLoading || !result) return <Text>Loading...</Text>;

  return (
    <Container title="End of the game">
      <View>
        {result
          .sort((a, b) => b.score - a.score)
          .map((result, index) => (
            <View key={result.user.id} className="flex-row gap-2">
              <Text>{index + 1}</Text>
              <Text>{result.user.name}</Text>
              <Text>{result.score}</Text>
              {result.user.id === user.id && <Text>(you)</Text>}
            </View>
          ))}
        <Button
          title="Go to room"
          onPress={() => router.navigate(`/room/${pin}`)}
        />
      </View>
    </Container>
  );
}
