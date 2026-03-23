import { Avatar } from "@/components/Avatar";
import { useCreateRoom, useJoinRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Button,
  CloseButton,
  FieldError,
  Input,
  InputOTP,
  useThemeColor,
} from "heroui-native";
import { Home } from "lucide-react-native";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Screen = "home" | "joining";

export default function Main() {
  const { user, setName } = useUserStore();
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const queryClient = useQueryClient();
  const [screen, setScreen] = useState<Screen>("home");
  const [otpError, setOtpError] = useState(false);
  const router = useRouter();

  const hasName = user.name.trim().length > 0;
  const foregroundColor = useThemeColor("foreground");

  async function handleCreateRoom() {
    await createRoom.mutate(
      {
        name: user.name,
        id: user.id,
      },
      {
        onSuccess: async (room) => {
          Sentry.logger.info("Room created", {
            pin: room.pin,
            userId: user.id,
            userName: user.name,
          });
          await queryClient.invalidateQueries({
            queryKey: userSessionQueryKey(user.id),
          });
          router.navigate(`/room/${room.pin}`);
        },
      },
    );
  }

  async function handleJoinRoom(pin: string) {
    await joinRoom.mutate(
      { pin, id: user.id, name: user.name },
      {
        onError: () => {
          setOtpError(true);
        },
        onSuccess: async () => {
          Sentry.logger.info("Room joined", {
            pin,
            userId: user.id,
            userName: user.name,
          });
          await queryClient.invalidateQueries({
            queryKey: userSessionQueryKey(user.id),
          });
          router.navigate(`/room/${pin}`);
        },
      },
    );
  }

  return (
    <View className="flex-1">
      {screen === "joining" && (
        <CloseButton
          className="absolute z-10 top-6 left-6"
          onPress={() => setScreen("home")}
          isDisabled={joinRoom.isPending}
          variant="ghost"
        >
          <Home size={20} color={foregroundColor} />
        </CloseButton>
      )}
      <Pressable
        className="items-stretch justify-center flex-1 gap-20 p-10"
        onPress={() => Keyboard.dismiss()}
      >
        {screen === "home" && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="gap-20"
          >
            <View className="gap-5">
              <Text className="text-5xl font-bold text-foreground">
                {i18n.t("homePage.title")}
              </Text>
              <View className="flex-row items-center gap-5">
                <Avatar name={user.name} />
                <View className="flex-1">
                  <Input
                    value={user.name}
                    onChangeText={setName}
                    placeholder={i18n.t("homePage.pseudoPlaceholder")}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
            {hasName && (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                className="gap-5"
              >
                <Button
                  onPress={handleCreateRoom}
                  isDisabled={!user.name || createRoom.isPending}
                >
                  <Button.Label>
                    {createRoom.isPending
                      ? i18n.t("homePage.createButtonPending")
                      : i18n.t("homePage.createButton")}
                  </Button.Label>
                </Button>
                <Button
                  onPress={() => setScreen("joining")}
                  isDisabled={!user.name || createRoom.isPending}
                >
                  <Button.Label>{i18n.t("homePage.joinButton")}</Button.Label>
                </Button>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {screen === "joining" && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="items-center gap-10"
          >
            <Text className="text-2xl font-bold text-foreground">
              {i18n.t("homePage.pinInputTitle")}
            </Text>
            <InputOTP
              maxLength={6}
              onComplete={handleJoinRoom}
              onChange={() => otpError && setOtpError(false)}
              isInvalid={otpError}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            {otpError && (
              <FieldError>{i18n.t("homePage.joinError")}</FieldError>
            )}
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}
