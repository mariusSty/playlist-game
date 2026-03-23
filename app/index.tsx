import { Avatar } from "@/components/Avatar";
import { useCreateRoom, useJoinRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Button, FieldError, Input, InputOTP } from "heroui-native";
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

  const hasName = user.name.trim().length > 0;

  async function handleCreateRoom() {
    await createRoom.mutate(
      {
        name: user.name,
        id: user.id,
      },
      {
        onSuccess: (room) => {
          Sentry.logger.info("Room created", {
            pin: room.pin,
            userId: user.id,
            userName: user.name,
          });
          queryClient.invalidateQueries({
            queryKey: userSessionQueryKey(user.id),
          });
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
        onSuccess: () => {
          Sentry.logger.info("Room joined", {
            pin,
            userId: user.id,
            userName: user.name,
          });
          queryClient.invalidateQueries({
            queryKey: userSessionQueryKey(user.id),
          });
        },
      },
    );
  }

  return (
    <View className="flex-1">
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
            <Button
              onPress={() => setScreen("home")}
              isDisabled={joinRoom.isPending}
            >
              <Button.Label>{i18n.t("homePage.cancelButton")}</Button.Label>
            </Button>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}
