import { cn } from "@/utils/cn";
import { forwardRef, Ref } from "react";
import { Pressable, Text, View } from "react-native";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  classNames?: string;
};

export const Button = forwardRef(function Button(
  { text, classNames, onPress }: ButtonProps,
  ref: Ref<View>
) {
  return (
    <Pressable
      className={cn(["w-full rounded-lg p-5 bg-white", classNames])}
      ref={ref}
      onPress={onPress}
    >
      <Text className="text-center font-bold text-xl text-black">{text}</Text>
    </Pressable>
  );
});
