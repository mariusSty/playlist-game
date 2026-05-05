import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { CloseButton, useThemeColor } from "heroui-native";
import { DoorOpen } from "lucide-react-native";
import { Alert } from "react-native";

export function LeaveRoomButton() {
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
    <CloseButton
      onPress={handleLeave}
      isDisabled={leaveRoom.isPending}
      variant="ghost"
    >
      <DoorOpen size={20} color={foregroundColor} />
    </CloseButton>
  );
}
