import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const players = [
  {
    name: "Player 1",
    score: 0,
  },
  {
    name: "Player 2",
    score: 0,
  },
  {
    name: "Player 3",
    score: 0,
  },
  {
    name: "Player 4",
    score: 0,
  },
];

export default function Vote() {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.replace("/room/id/round/id/reveal");
    }
  }, [counter]);

  return (
    <Container title="Listen and Vote !">
      <Text className="text-9xl text-white">{counter}</Text>
      <View className="w-full">
        {players.map((player, index) => (
          <View
            key={index}
            className="flex-row w-full gap-5 justify-evenly py-5"
          >
            <Text className="text-white text-lg">{index}</Text>
            <Text className="text-white text-lg" key={index}>
              {player.name}
            </Text>

            <Link href="/room/id/round/id/reveal" asChild>
              <Button text="v" />
            </Link>
          </View>
        ))}
      </View>
    </Container>
  );
}
