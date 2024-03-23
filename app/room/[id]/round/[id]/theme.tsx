import Container from "@/components/Container";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function RoundTheme() {
  return (
    <Container title="Round 1">
      <View>
        <Text>Choose the theme</Text>
        <Text style={styles.counter}>10</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Link href="/room/id/round/id/song" asChild>
            <Pressable>
              <Text>Theme 1</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.button}>
          <Link href="/room/id/round/id/song" asChild>
            <Pressable>
              <Text>Theme 2</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.button}>
          <Link href="/room/id/round/id/song" asChild>
            <Pressable>
              <Text>Theme 3</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.button}>
          <Link href="/room/id/round/id/song" asChild>
            <Pressable>
              <Text>Theme 4</Text>
            </Pressable>
          </Link>
        </View>
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
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    padding: 10,
  },
});
