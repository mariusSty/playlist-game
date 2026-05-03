import { Button, Spinner, useThemeColor } from "heroui-native";
import { ComponentProps, ReactNode } from "react";
import { View } from "react-native";

type ButtonProps = Omit<ComponentProps<typeof Button>, "variant">;

type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean;
  children: ReactNode;
};

export function LoadingButton({
  isLoading = false,
  isDisabled,
  children,
  ...rest
}: LoadingButtonProps) {
  const spinnerColor = useThemeColor("accent-foreground");

  return (
    <Button
      {...(rest as ComponentProps<typeof Button>)}
      isDisabled={isLoading || isDisabled}
    >
      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>
      {isLoading && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Spinner size="sm" color={spinnerColor} />
        </View>
      )}
    </Button>
  );
}
