import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { themes } from "@/constants/theme";
import { UserContext } from "@/contexts/user-context";
import { useGame } from "@/hooks/useGame";
import { getCurrentRound } from "@/utils/game";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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

  useFocusEffect(() => {
    const timer = setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        handleChoose(themes[Math.round(Math.random() * themes.length)]);
        clearTimeout(timer);
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  useFocusEffect(() => {
    socket.on("themePicked", ({ roundId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/song`);
      }
    });

    return () => {
      socket.off("themePicked");
    };
  });

  if (isGameLoading || !game || !user) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </Container>
    );
  }

  const currentRound = getCurrentRound(game, Number(roundId));
  const isThemeMaster = currentRound?.themeMaster.id === user.id;

  if (isThemeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View className="gap-5">
          <Text className="text-xl dark:text-white">
            {i18n.t("themePage.themeMaster")}
          </Text>
          <Text className="text-center dark:text-white text-9xl">
            {counter}
          </Text>
        </View>
        <View className="items-stretch gap-y-5">
          {themes.map((theme, index) => (
            <Button
              key={index}
              onPress={() => handleChoose(theme)}
              text={i18n.t(`themePage.themes.${theme}`)}
            />
          ))}
        </View>
      </Container>
    );
  }

  return (
    <Container title="Round 1">
      <View className="gap-5">
        <Text className="text-xl dark:text-white">
          {i18n.t("themePage.waiting", {
            name: currentRound?.themeMaster.name,
          })}
        </Text>
        <Text className="text-center dark:text-white text-9xl">{counter}</Text>
      </View>
    </Container>
  );
}
