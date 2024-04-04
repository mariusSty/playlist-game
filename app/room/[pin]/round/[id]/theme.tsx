import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { Text, TextInput } from "@/components/Themed";
import { Theme } from "@/types/room";

import { StyleSheet, View } from "react-native";
import useSWR from "swr";

const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());

export default function RoundTheme() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { data: themes = [], isLoading } = useSWR<Theme[]>(
    `${apiUrl}/theme?limit=4`,
    fetcher
  );

  function handleChoose() {
    console.log("Choose theme");
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

  return (
    <Container title="Round 1">
      <View>
        <Text>Choose the theme</Text>
        <Text style={styles.counter}>10</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {themes.map((theme) => (
          <Button
            key={theme.id}
            onPress={handleChoose}
            text={theme.description}
          />
        ))}
        <TextInput
          style={styles.textInput}
          placeholder="Write your own theme..."
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
