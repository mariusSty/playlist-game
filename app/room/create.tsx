import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

const player = [
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

export default function CreateRoom() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN : 0000</Text>
      <View style={styles.list}>
        {player.map((player, index) => (
          <View key={index}>
            <Text>{player.name}</Text>
          </View>
        ))}
      </View>
      <Link href="/room/id/round/id/theme" asChild>
        <Pressable>
          <Text>Start the game</Text>
        </Pressable>
      </Link>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    gap: 20,
  },
});
