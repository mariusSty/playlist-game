/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  StyleSheet,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorScheme = useColorScheme();

  const themeTextInputStyle =
    colorScheme === "light" ? styles.lightTextInput : styles.darkTextInput;
  const placeholderTextColor =
    colorScheme === "light" ? Colors.light.tint : Colors.dark.tint;

  return (
    <DefaultTextInput
      style={[{ color }, style, styles.textInput, themeTextInputStyle]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  lightTextInput: {
    borderColor: Colors.light.text,
    color: Colors.light.text,
  },
  darkTextInput: {
    borderColor: Colors.dark.text,
    color: Colors.dark.text,
  },
});
