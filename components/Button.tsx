import { Text } from "@/components/Themed";
import { forwardRef, Ref } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

type ButtonProps = {
  text: string;
  onPress?: () => void;
};

export const Button = forwardRef(function Button(
  { text, onPress }: ButtonProps,
  ref: Ref<View>
) {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightButton : styles.darkButton;
  const themeTextStyle =
    colorScheme === "light" ? styles.lightButtonText : styles.darkButtonText;

  return (
    <Pressable
      style={[styles.button, themeContainerStyle]}
      ref={ref}
      onPress={onPress}
    >
      <Text style={[styles.text, themeTextStyle]}>{text}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  lightButton: {
    backgroundColor: "#000",
  },
  darkButton: {
    backgroundColor: "#fff",
  },
  lightButtonText: {
    color: "#fff",
  },
  darkButtonText: {
    color: "#000",
  },
});
