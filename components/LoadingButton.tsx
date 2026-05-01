import { Button, Spinner } from "heroui-native";
import { ComponentProps, ReactNode } from "react";
import { View } from "react-native";

type ButtonProps = ComponentProps<typeof Button>;

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
  return (
    <Button {...(rest as ButtonProps)} isDisabled={isLoading || isDisabled}>
      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>
      {isLoading && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Spinner size="sm" />
        </View>
      )}
    </Button>
  );
}
