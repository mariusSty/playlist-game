import { forwardRef, Ref } from "react";
import { Pressable, Text, View } from "react-native";

type ButtonProps = {
  text: string;
  onPress?: () => void;
};

export const Button = forwardRef(function Button(
  { text, onPress }: ButtonProps,
  ref: Ref<View>
) {
  return (
    <Pressable
      className="w-full p-5 rounded-lg"
      style={{ backgroundColor: "#FFFFFF" }}
      ref={ref}
      onPress={onPress}
    >
      <Text className="text-center font-bold text-2xl text-black">{text}</Text>
    </Pressable>
  );
});
