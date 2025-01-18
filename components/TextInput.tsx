import { cn } from "@/utils/cn";
import { TextInputProps, useColorScheme } from "react-native";

export function TextInput({
  value,
  onChangeText,
  placeholder,
  className,
  ...props
}: TextInputProps) {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={cn([
        "w-full py-3 text-xl text-center text-white border rounded-lg",
        colorScheme === "dark" ? "border-white" : "border-black",
        className,
      ])}
      {...props}
    />
  );
}
