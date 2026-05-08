import i18n from "@/utils/translation";
import { Text } from "react-native";

type PlayerCountProps = {
  count: number;
};

export function PlayerCount({ count }: PlayerCountProps) {
  return (
    <Text className="text-base text-foreground/70">
      {i18n.t("startPage.playerCount", { count })}
    </Text>
  );
}
