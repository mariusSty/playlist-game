import { SpinButton } from "@/components/SpinButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { View } from "react-native";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  classNames?: string;
  disabled?: boolean;
  isPending?: boolean;
};

export function Button({
  text,
  classNames,
  onPress,
  disabled,
  isPending = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  const button = (
    <SpinButton
      idleText={text}
      controlled
      isActive={isPending}
      disabled={disabled || isPending}
      onPress={() => onPress?.()}
      colors={{
        idle: {
          background: colors.tint,
          text: colors.background,
        },
        active: {
          background: scheme === "dark" ? "#cccccc" : "#333333",
          text: colors.background,
        },
      }}
      spinnerConfig={{
        color: colors.background,
        containerBackground: scheme === "dark" ? "#aaaaaa" : "#555555",
      }}
      buttonStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        fontSize: 16,
        fontWeight: "700",
      }}
    />
  );

  if (classNames) {
    return <View className={classNames}>{button}</View>;
  }

  return button;
}
