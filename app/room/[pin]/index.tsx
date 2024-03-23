import { Button } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { Room } from "@/types/room";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import useSwr from "swr";

const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());

export default function CreateRoom() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const { pin } = useLocalSearchParams();
  const { data: room, isLoading } = useSwr<Room>(
    `${apiUrl}/room/${pin}`,
    fetcher
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!room) router.navigate("/room/join");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN : {pin}</Text>
      <ScrollView style={styles.scrollList}>
        <View style={styles.list}>
          {room?.users.map((user, index) => (
            <View style={styles.item} key={index}>
              <Image
                style={styles.image}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
                contentFit="cover"
                transition={1000}
              />
              <Text style={styles.text}>{user.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollList: {
    maxHeight: "50%",
  },
  list: {
    gap: 30,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  text: {
    fontSize: 30,
  },
  button: {
    width: "100%",
    paddingHorizontal: 40,
  },
});
