import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularLoaderProps {
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly activeColor?: string;
  readonly duration?: number;
}

export function CircularLoader({
  size = 20,
  strokeWidth = 1.6,
  activeColor = "#FFFFFF",
  duration = 800,
}: CircularLoaderProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [duration]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - 0.25),
    transform: [
      { translateX: size / 2 },
      { translateY: size / 2 },
      { rotate: `${progress.value * 360}deg` },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ],
  }));

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={activeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
