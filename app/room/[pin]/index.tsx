import { Button } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

const player = [
  {
    name: "Player 1",
  },
  {
    name: "Player 2",
  },
  {
    name: "Player 3",
  },
  {
    name: "Player 4",
  },
];

export default function CreateRoom() {
  const { pin } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN : {pin}</Text>
      <View style={styles.list}>
        {player.map((player, index) => (
          <View key={index}>
            <Text style={styles.text}>{player.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.button}>
        <Link href="/room/id/round/id/theme" asChild>
          <Button text="Start game" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  list: {
    gap: 30,
  },
  text: {
    fontSize: 20,
  },
  button: {
    width: "100%",
    paddingHorizontal: 40,
  },
});
