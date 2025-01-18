import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { useGame } from "@/hooks/useGame";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Text, View } from "react-native";

const themes = [
  "Son qui te rappelle ton enfance",
  "Son pour danser",
  "Son pour dormir",
  "Son que tu écoutes en boucle",
  "Gulty pleasure",
];

export default function RoundTheme() {
  const [counter, setCounter] = useState(10);
  const { user } = useContext(UserContext);
  const { pin, gameId, roundId } = useLocalSearchParams();

  const { game, isGameLoading } = useGame(gameId.toString());

  function handleChoose(theme: string) {
    if (game) {
      socket.emit("pickTheme", {
        roundId,
        theme,
        pin,
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (counter > 0) {
          setCounter(counter - 1);
        } else {
          handleChoose(themes[Math.round(Math.random() * themes.length)]);
          clearTimeout(timer);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }, [counter])
  );

  useFocusEffect(
    useCallback(() => {
      socket.on("themePicked", ({ roundId, pin: pinFromSocket }) => {
        if (pinFromSocket === pin) {
          router.navigate(`/room/${pin}/${gameId}/${roundId}/song`);
        }
      });

      return () => {
        socket.off("themePicked");
      };
    }, [])
  );

  if (isGameLoading || !game || !user) {
    return (
      <Container title="Round 1">
        <View>
          <Text>Loading...</Text>
        </View>
      </Container>
    );
  }

  const currentRound = getCurrentRound(game, Number(roundId));
  const isThemeMaster = currentRound?.themeMaster.id === user.id;

  if (isThemeMaster) {
    return (
      <Container title="Choose the theme">
        <View className="gap-5">
          <Text className="text-white">
            Theme master is {currentRound?.themeMaster.name}
          </Text>
          <Text className="text-center text-white text-9xl">{counter}</Text>
        </View>
        <View className="flex-row flex-wrap w-full px-10 gap-y-5">
          {themes.map((theme, index) => (
            <Button
              key={index}
              onPress={() => handleChoose(theme)}
              text={theme}
            />
          ))}
        </View>
      </Container>
    );
  }

  return (
    <Container title="Round 1">
      <View className="gap-5">
        <Text className="text-white">
          Theme master is {currentRound?.themeMaster.name}
        </Text>
        <Text className="text-white">Waiting...</Text>
        <Text className="text-center text-white text-9xl">{counter}</Text>
      </View>
    </Container>
  );
}
