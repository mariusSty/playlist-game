import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useResult } from "@/hooks/useGame";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function Result() {
  const { pin, gameId } = useLocalSearchParams();
  const { result, isResultLoading } = useResult(gameId.toString());
  const { user } = useContext(UserContext);

  if (isResultLoading || !result) return <Text>Loading...</Text>;

  return (
    <Container title="Results">
      <View className="gap-4 my-auto">
        {result
          .sort((a, b) => b.score - a.score)
          .map((result, index) => (
            <View
              key={result.user.id}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-xl dark:text-white">{index + 1}</Text>
                <Image
                  style={{ width: 50, height: 50, borderRadius: 5 }}
                  source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${result.user.name}`}
                  contentFit="cover"
                  transition={1000}
                />
                <Text className="text-xl dark:text-white">
                  {result.user.name}
                </Text>
              </View>
              <Text className="text-xl dark:text-white">
                {result.score} {result.score <= 1 ? "point" : "points"}
              </Text>
            </View>
          ))}
      </View>
      <Button
        text="Exit game"
        onPress={() => router.navigate(`/room/${pin}`)}
      />
    </Container>
  );
}
