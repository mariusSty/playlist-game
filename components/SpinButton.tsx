import { CircularLoader } from "@/components/Circular";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, TextStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type ButtonColors = {
  idle: { background: string; text: string };
  active: { background: string; text: string };
};

type SpinnerConfig = {
  size: number;
  strokeWidth: number;
  color: string;
  containerSize: number;
  containerBackground: string;
  position: { right: number; top: number };
};

type ButtonStyleConfig = {
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
};

export type SpinButtonProps = {
  idleText?: string;
  colors?: Partial<ButtonColors>;
  spinnerConfig?: Partial<SpinnerConfig>;
  buttonStyle?: Partial<ButtonStyleConfig>;
  onPress?: (isActive: boolean) => void;
  onStateChange?: (isActive: boolean) => void;
  initialState?: boolean;
  disabled?: boolean;
  controlled?: boolean;
  isActive?: boolean;
};

const DEFAULT_BUTTON_COLORS: ButtonColors = {
  idle: { background: "#e6e6e6", text: "#000000" },
  active: { background: "#121212", text: "#FFFFFF" },
};

const DEFAULT_SPINNER_CONFIG: SpinnerConfig = {
  size: 20,
  strokeWidth: 1.6,
  color: "#FFFFFF",
  containerSize: 35,
  containerBackground: "#121212",
  position: { right: -12, top: -12 },
};

const DEFAULT_BUTTON_STYLE: ButtonStyleConfig = {
  paddingHorizontal: 40,
  paddingVertical: 12,
  borderRadius: 99,
  fontSize: 17,
  fontWeight: "700",
};

const PRESS_DURATION = { press: 80, release: 150 } as const;
const COLOR_TRANSITION_DURATION = 300;
const SPINNER_ENTER_DURATION = 250;
const SPINNER_EXIT_DURATION = 200;

const mergeDeep = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
): T => {
  const output = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = mergeDeep(
        output[key] as Record<string, any>,
        source[key] as Record<string, any>,
      ) as T[Extract<keyof T, string>];
    } else if (source[key] !== undefined) {
      output[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return output;
};

export function SpinButton({
  idleText = "Save",
  colors,
  spinnerConfig,
  buttonStyle,
  onPress,
  onStateChange,
  initialState = false,
  disabled = false,
  controlled = false,
  isActive,
}: SpinButtonProps) {
  const [internalState, setInternalState] = useState(initialState);
  const isSaving = controlled ? (isActive ?? false) : internalState;

  const mergedColors = mergeDeep(DEFAULT_BUTTON_COLORS, colors ?? {});
  const mergedSpinnerConfig = mergeDeep(
    DEFAULT_SPINNER_CONFIG,
    spinnerConfig ?? {},
  );
  const mergedButtonStyle = mergeDeep(DEFAULT_BUTTON_STYLE, buttonStyle ?? {});

  const buttonScale = useSharedValue(1);
  const buttonBackgroundProgress = useSharedValue(initialState ? 1 : 0);
  const textColorProgress = useSharedValue(initialState ? 1 : 0);
  const spinnerScale = useSharedValue(initialState ? 1 : 0);
  const spinnerRotation = useSharedValue(0);

  const prevIsActive = useRef(isActive);

  useEffect(() => {
    if (!controlled) return;
    if (isActive === prevIsActive.current) return;
    prevIsActive.current = isActive;

    buttonBackgroundProgress.value = withTiming(isActive ? 1 : 0, {
      duration: COLOR_TRANSITION_DURATION,
    });
    textColorProgress.value = withTiming(isActive ? 1 : 0, {
      duration: COLOR_TRANSITION_DURATION,
    });

    if (isActive) {
      spinnerScale.value = withTiming(1, {
        duration: SPINNER_ENTER_DURATION,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      });
      spinnerRotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      spinnerScale.value = withTiming(0, {
        duration: SPINNER_EXIT_DURATION,
        easing: Easing.ease,
      });
      spinnerRotation.value = withTiming(0, {
        duration: SPINNER_EXIT_DURATION,
      });
    }
  }, [isActive, controlled]);

  const handlePress = useCallback((): void => {
    if (disabled) return;

    const newState = !isSaving;
    if (!controlled) setInternalState(newState);

    onPress?.(newState);
    onStateChange?.(newState);

    buttonBackgroundProgress.value = withTiming(newState ? 1 : 0, {
      duration: COLOR_TRANSITION_DURATION,
    });
    textColorProgress.value = withTiming(newState ? 1 : 0, {
      duration: COLOR_TRANSITION_DURATION,
    });

    if (newState) {
      spinnerScale.value = withTiming(1, {
        duration: SPINNER_ENTER_DURATION,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      });
      spinnerRotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      spinnerScale.value = withTiming(0, {
        duration: SPINNER_EXIT_DURATION,
        easing: Easing.ease,
      });
      spinnerRotation.value = withTiming(0, {
        duration: SPINNER_EXIT_DURATION,
      });
    }

    buttonScale.value = withTiming(0.96, { duration: PRESS_DURATION.press });
    buttonScale.value = withTiming(1, {
      duration: PRESS_DURATION.release,
      easing: Easing.out(Easing.ease),
    });
  }, [
    disabled,
    isSaving,
    controlled,
    onPress,
    onStateChange,
    buttonBackgroundProgress,
    textColorProgress,
    spinnerScale,
    spinnerRotation,
    buttonScale,
  ]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: interpolateColor(
      buttonBackgroundProgress.value,
      [0, 1],
      [mergedColors.idle.background, mergedColors.active.background],
    ),
    opacity: 1,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      textColorProgress.value,
      [0, 1],
      [mergedColors.idle.text, mergedColors.active.text],
    ),
  }));

  const animatedSpinnerContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: spinnerScale.value }],
    opacity: spinnerScale.value,
    backgroundColor: interpolateColor(
      spinnerScale.value,
      [0, 1],
      ["transparent", mergedSpinnerConfig.containerBackground],
    ),
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={{ overflow: "visible" }}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: mergedButtonStyle.paddingHorizontal,
            paddingVertical: mergedButtonStyle.paddingVertical,
            borderRadius: mergedButtonStyle.borderRadius,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "visible",
          },
          animatedButtonStyle,
        ]}
      >
        <Animated.Text
          style={[
            {
              fontSize: mergedButtonStyle.fontSize,
              fontWeight: mergedButtonStyle.fontWeight,
            },
            animatedTextStyle,
          ]}
        >
          {idleText}
        </Animated.Text>

        <Animated.View
          style={[
            {
              position: "absolute",
              right: mergedSpinnerConfig.position.right,
              top: mergedSpinnerConfig.position.top,
              width: mergedSpinnerConfig.containerSize,
              height: mergedSpinnerConfig.containerSize,
              borderRadius: 99,
              justifyContent: "center",
              alignItems: "center",
            },
            animatedSpinnerContainerStyle,
          ]}
        >
          <Animated.View
            style={{
              width: mergedSpinnerConfig.size,
              height: mergedSpinnerConfig.size,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularLoader
              activeColor={mergedSpinnerConfig.color}
              size={mergedSpinnerConfig.size}
              strokeWidth={mergedSpinnerConfig.strokeWidth}
              duration={800}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
