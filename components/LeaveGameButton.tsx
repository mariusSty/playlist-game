import { useColorScheme } from "@/components/useColorScheme";
import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { DoorOpen } from "lucide-react-native";
import { Alert, Pressable } from "react-native";

export function LeaveGameButton() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const leaveRoom = useLeaveRoom();

  function handlePress() {
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
    <Pressable onPress={handlePress} disabled={leaveRoom.isPending}>
      <DoorOpen size={24} color={isDarkMode ? "white" : "black"} />
    </Pressable>
  );
}
