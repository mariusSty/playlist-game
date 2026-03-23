import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { CloseButton, useThemeColor } from "heroui-native";
import { DoorOpen } from "lucide-react-native";
import { ReactNode } from "react";
import { Alert, Text, View } from "react-native";

type ContainerProps = {
  children: ReactNode;
  title: string;
};

export default function Container({ children, title }: ContainerProps) {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const leaveRoom = useLeaveRoom();
  const foregroundColor = useThemeColor("foreground");

  function handleLeave() {
    Alert.alert(
      i18n.t("leaveGame.confirmTitle"),
      i18n.t("leaveGame.confirmMessage"),
      [
        {
          text: i18n.t("leaveGame.cancelButton"),
          style: "cancel",
        },
        {
          text: i18n.t("leaveGame.confirmButton"),
          style: "destructive",
          onPress: () => {
            leaveRoom.mutate(
              { pin, userId: user.id },
              {
                onSuccess: async () => {
                  await queryClient.invalidateQueries({
                    queryKey: userSessionQueryKey(user.id),
                  });
                  router.navigate("/");
                },
              },
            );
          },
        },
      ],
    );
  }

  return (
    <View className="items-center flex-1 gap-8 p-8">
      <View className="w-full gap-4">
        <CloseButton
          onPress={handleLeave}
          isDisabled={leaveRoom.isPending}
          variant="ghost"
        >
          <DoorOpen size={20} color={foregroundColor} />
        </CloseButton>
        <Text className="w-full text-3xl font-bold text-center text-foreground">
          {title}
        </Text>
      </View>
      <View className="justify-around flex-1 w-full">{children}</View>
    </View>
  );
}
