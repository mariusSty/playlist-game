import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Text, TextInput } from "@/components/Themed";
import { Theme } from "@/types/room";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";
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
      <View>
        <Text>Choose the theme</Text>
        <Text style={styles.counter}>{counter}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {themes.map((theme) => (
          <Button
            key={theme.id}
            onPress={() => handleChoose(theme)}
            text={theme.description}
          />
        ))}
        <TextInput
          style={styles.textInput}
          placeholder="Write your own theme..."
          onChangeText={handleUpdateCustomThemeText}
          onFocus={() => setThemePicked(null)}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  counter: {
    fontSize: 100,
  },
  buttonsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 40,
    rowGap: 20,
  },
  ring: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "red",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 20,
    color: "white",
    borderColor: "white",
    flex: 1,
    textAlign: "center",
  },
});
