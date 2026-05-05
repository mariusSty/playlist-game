import { Avatar } from "@/components/Avatar";
import i18n from "@/utils/translation";
import { Text, View } from "react-native";

export function ThemeWaiting({ name }: { name: string }) {
  return (
    <View className="items-center py-8 gap-y-2">
      <Avatar name={name} />
      <Text className="text-xl font-bold text-foreground">
        {i18n.t("themePage.waiting", { name })}
      </Text>
      <Text className="text-lg text-foreground">
        {i18n.t("themePage.waitingSubtitle")}
      </Text>
    </View>
  );
}
