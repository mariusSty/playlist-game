import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { Game, Theme } from "@/types/room";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { io } from "socket.io-client";
import useSWR from "swr";

const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/rooms`);

const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());

export default function RoundTheme() {
  const [counter, setCounter] = useState(10);
  const { user } = useContext(UserContext);
  const { pin } = useLocalSearchParams();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { data: themes = [], isLoading } = useSWR<Theme[]>(
    `${apiUrl}/theme?limit=4`,
    fetcher
  );
  const { data: game, isLoading: isRoomLoading } = useSWR<Game>(
    `${apiUrl}/game/${pin}`,
    fetcher
  );

  function handleChoose(theme: Theme) {
    if (game) {
      socket.emit("pickTheme", {
        roundId: game.actualRound?.id,
        themeId: theme.id,
      });
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        handleChoose(themes[Math.round(Math.random() * themes.length)]);
        clearTimeout(timer);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  useEffect(() => {
    socket.on("themePicked", ({ roundId }) => {
      router.navigate(`/room/${pin}/round/${roundId}/song`);
    });

    return () => {
      socket.off("themePicked");
    };
  });

  if (isLoading || isRoomLoading || !game || !user) {
    return (
      <Container title="Round 1">
        <View>
          <Text>Loading...</Text>
        </View>
      </Container>
    );
  }

  const isHost = game.actualRound?.themeMaster.id === user.id;
  if (isHost) {
    return (
      <Container title="Round 1">
        <View className="gap-5">
          <Text className="text-white">Choose the theme</Text>
          <Text className="text-center text-white text-9xl">{counter}</Text>
        </View>
        <View className="flex-row flex-wrap w-full px-10 gap-y-5">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              onPress={() => handleChoose(theme)}
              text={theme.description}
            />
          ))}
        </View>
      </Container>
    );
  }

  return (
    <Container title="Round 1">
      <View className="gap-5">
        <Text className="text-white">Waiting...</Text>
        <Text className="text-center text-white text-9xl">{counter}</Text>
      </View>
    </Container>
  );
}
