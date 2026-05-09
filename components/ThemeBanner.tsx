import i18n from "@/utils/translation";
import { Text, View } from "react-native";

export function ThemeBanner({ theme }: { theme: string }) {
  return (
    <View className="w-full p-4 bg-foreground/5 border border-foreground/10 rounded-2xl items-center gap-1">
      <Text className="text-xs text-foreground/60 uppercase tracking-widest">
        {i18n.t("pickPage.themeLabel")}
      </Text>
      <Text className="text-2xl font-bold text-foreground text-center">
        {theme}
      </Text>
    </View>
  );
}
