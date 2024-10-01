import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { Room, Theme } from "@/types/room";
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
  const [themePicked, setThemePicked] = useState<Theme | null>(null);
  const { user } = useContext(UserContext);
  const { pin } = useLocalSearchParams();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { data: themes = [], isLoading } = useSWR<Theme[]>(
    `${apiUrl}/theme?limit=4`,
    fetcher
  );
  const { data: room, isLoading: isRoomLoading } = useSWR<Room>(
    !!pin ? `${apiUrl}/room/${pin}` : null,
    fetcher
  );

  function handleChoose(theme: Theme) {
    socket.emit("pickTheme", { pin, themeId: theme.id });
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
    socket.on("themePicked", ({ pin }) => {
      router.navigate(`/room/${pin}/round/1/song`);
    });

    return () => {
      socket.off("themePicked");
    };
  });

  if (isLoading || isRoomLoading || !room || !user) {
    return (
      <Container title="Round 1">
        <View>
          <Text>Loading...</Text>
        </View>
      </Container>
    );
  }

  const isHost = room?.host.id === user.id;
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
              classNames={themePicked?.id === theme.id ? "bg-green-500" : ""}
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
