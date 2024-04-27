import Container from "@/components/Container";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  return (
    <Container title="Listen and Vote !">
      <Text style={styles.counter}>10</Text>
      <View style={styles.list}>
        {players.map((player, index) => (
          <View style={styles.item} key={index}>
            <Text style={styles.text}>{index}</Text>
            <Text style={styles.text} key={index}>
              {player.name}
            </Text>

            <Link href="/room/id/round/id/reveal" asChild>
              <Pressable>
                <Text style={styles.text}>V</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  counter: {
    fontSize: 100,
  },
  list: {
    width: "100%",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 20,
  },
});
