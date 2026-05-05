import { Theme } from "@/types/room";
import { splitEmoji } from "@/utils/splitEmoji";
import i18n from "@/utils/translation";
import { Pressable, Text, View } from "react-native";

type ThemeTileProps = {
  theme: Theme;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function ThemeTile({
  theme,
  isSelected,
  disabled,
  onPress,
}: ThemeTileProps) {
  const { emoji } = splitEmoji(i18n.t(`themePage.themes.${theme.key}`));
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-[22%] aspect-square rounded-2xl border-2 ${
        isSelected
          ? "border-foreground bg-foreground/10"
          : "border-foreground/10 bg-foreground/5"
      }`}
    >
      <View className="items-center justify-center flex-1">
        <Text>{emoji}</Text>
      </View>
    </Pressable>
  );
}
