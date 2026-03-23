import { SpinButton } from "@/components/SpinButton";
import { useColorScheme, View } from "react-native";

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
  const isDark = useColorScheme() === "dark";

  const button = (
    <SpinButton
      idleText={text}
      controlled
      isActive={isPending}
      disabled={disabled || isPending}
      onPress={() => onPress?.()}
      colors={{
        idle: {
          background: isDark ? "#ffffff" : "#000000",
          text: isDark ? "#000000" : "#ffffff",
        },
        active: {
          background: isDark ? "#cccccc" : "#333333",
          text: isDark ? "#000000" : "#ffffff",
        },
      }}
      spinnerConfig={{
        color: isDark ? "#000000" : "#ffffff",
        containerBackground: isDark ? "#aaaaaa" : "#555555",
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
