import { cn } from "@/utils/cn";
import { TextInput, TextInputProps } from "react-native";

export function ThemedTextInput({
  value,
  onChangeText,
  placeholder,
  className,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={cn([
        "w-full py-3 text-xl text-center text-black dark:text-white border rounded-lg border-black dark:border-white",
        className,
      ])}
      {...props}
    />
  );
}
