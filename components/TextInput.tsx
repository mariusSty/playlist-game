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
      autoCorrect={false}
      autoCapitalize="none"
      spellCheck={false}
      className={cn([
        "w-full py-3 text-xl text-center text-foreground border rounded-lg border-foreground",
        className,
      ])}
      {...props}
    />
  );
}
