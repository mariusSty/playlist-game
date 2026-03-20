import { roomQueryKey } from "@/hooks/useRoom";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { socket } from "@/utils/server";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";

export function useSessionSocket(userId: string, pin: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pin) {
      if (socket.connected) {
        socket.emit("session:unsubscribe", { pin, userId });
        socket.disconnect();
      }
      return;
    }

    function subscribe() {
      socket.emit("session:subscribe", { pin, userId });
      queryClient.invalidateQueries();
    }

    function onSessionUpdated() {
      queryClient.invalidateQueries({ queryKey: userSessionQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: roomQueryKey(pin!) });
      queryClient.invalidateQueries({ queryKey: ["round"] });
      queryClient.invalidateQueries({ queryKey: ["pick"] });
    }

    function onAppStateChange(state: string) {
      if (state === "active") {
        if (!socket.connected) {
          socket.connect();
        } else {
          subscribe();
        }
      }
    }

    socket.on("connect", subscribe);
    socket.on("session:updated", onSessionUpdated);
    socket.connect();

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
      socket.off("connect", subscribe);
      socket.off("session:updated", onSessionUpdated);
      socket.emit("session:unsubscribe", { pin, userId });
      socket.disconnect();
    };
  }, [pin, userId, queryClient]);
}
