import Container from "@/components/Container";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const songs = [
  {
    name: "Song 1",
    artist: "Artist 1",
  },
  {
    name: "Song 2",
    artist: "Artist 2",
  },
  {
    name: "Song 3",
    artist: "Artist 3",
  },
  {
    name: "Song 4",
    artist: "Artist 4",
  },
];

export default function Song() {
  return (
    <Container title="Theme is...">
      <View>
        <Text>Choose the song</Text>
      </View>
      <TextInput placeholder="Song name" />
      <View>
        {songs.map((song, index) => (
          <View style={styles.song} key={index}>
            <Text>{song.name}</Text>
            <Text>{song.artist}</Text>
            <Link href="/room/id/round/id/vote" asChild>
              <Pressable>
                <Text>Choose</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  song: {
    flexDirection: "row",
    gap: 20,
  },
});
