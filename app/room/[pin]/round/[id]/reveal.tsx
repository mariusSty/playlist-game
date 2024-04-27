import Container from "@/components/Container";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Reveal() {
  return (
    <Container title="Song reveal">
      <View>
        <Text style={styles.song}>1. Song - Artist</Text>
      </View>
      <View style={styles.choose}>
        <Text style={styles.text}>Choose by</Text>
        <Text style={styles.song}>Player 1</Text>
        <Link asChild href="/room/id/round/id/result">
          <Pressable>
            <Text style={styles.text}>+10 points</Text>
          </Pressable>
        </Link>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  song: {
    fontSize: 30,
  },
  choose: {
    gap: 20,
  },
  text: {
    fontSize: 20,
  },
});
