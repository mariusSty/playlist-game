import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Theme } from "@/types/room";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { Text, TextInput, View } from "react-native";
import useSWR from "swr";

const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());

export default function RoundTheme() {
  const [counter, setCounter] = useState(10);
  const [themePicked, setThemePicked] = useState<Theme | null>(null);
  const [customTheme, setCustomTheme] = useState("");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { data: themes = [], isLoading } = useSWR<Theme[]>(
    `${apiUrl}/theme?limit=4`,
    fetcher
  );

  function handleChoose(theme: Theme) {
    setThemePicked(theme);
  }

  function handleUpdateCustomThemeText(customThemeText: string) {
    setCustomTheme(customThemeText);
    setThemePicked(null);
  }

  if (isLoading) {
    return (
      <Container title="Round 1">
        <View>
          <Text>Loading...</Text>
        </View>
      </Container>
    );
  }

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.replace("/room/id/round/id/song");
    }
  }, [counter]);

  return (
    <Container title="Round 1">
      <View className="gap-5">
        <Text className="text-white">Choose the theme</Text>
        <Text className="text-9xl text-white">{counter}</Text>
      </View>
      <View className="flex-wrap flex-row w-full px-10 gap-y-5">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            onPress={() => handleChoose(theme)}
            text={theme.description}
          />
        ))}
        <TextInput
          className="w-full text-white text-xl border border-white rounded-lg py-5 text-center"
          placeholder="Write your own theme..."
          onChangeText={handleUpdateCustomThemeText}
          onFocus={() => setThemePicked(null)}
        />
      </View>
    </Container>
  );
}
