import { Avatar } from "@/components/Avatar";
import { OtpInput } from "@/components/base";
import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { useColorScheme } from "@/components/useColorScheme";
import { useCreateRoom, useJoinRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Screen = "home" | "joining";

export default function Main() {
  const { user, setName } = useUserStore();
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [screen, setScreen] = useState<Screen>("home");
  const [otpError, setOtpError] = useState(false);

  const isDark = colorScheme === "dark";
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
              <Text className="text-5xl font-bold text-black dark:text-white">
                {i18n.t("homePage.title")}
              </Text>
              <View className="flex-row items-center gap-5">
                <Avatar name={user.name} />
                <View className="flex-1">
                  <ThemedTextInput
                    value={user.name}
                    onChangeText={setName}
                    placeholder={i18n.t("homePage.pseudoPlaceholder")}
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
                  text={i18n.t("homePage.createButton")}
                  onPress={handleCreateRoom}
                  isPending={createRoom.isPending}
                  disabled={!user.name}
                />
                <Button
                  text={i18n.t("homePage.joinButton")}
                  onPress={() => setScreen("joining")}
                  disabled={!user.name || createRoom.isPending}
                />
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
            <Text className="text-2xl font-bold text-black dark:text-white">
              {i18n.t("homePage.pinInputTitle")}
            </Text>
            <OtpInput
              otpCount={6}
              enableAutoFocus
              animationVariant="fadeSlideDown"
              inputBorderRadius={10}
              inputWidth={50}
              inputHeight={60}
              focusedBackgroundColor={isDark ? "#000000" : "#ffffff"}
              unfocusedBackgroundColor={isDark ? "#000000" : "#ffffff"}
              focusedBorderColor={isDark ? "#ffffff" : "#000000"}
              unfocusedBorderColor={isDark ? "#ffffff" : "#000000"}
              textStyle={{
                color: isDark ? "#f8fafc" : "#000000",
                fontSize: 22,
              }}
              onInputChange={() => otpError && setOtpError(false)}
              onInputFinished={handleJoinRoom}
              error={otpError}
              errorMessage={i18n.t("homePage.joinError")}
            />
            <Button
              text={i18n.t("homePage.cancelButton")}
              onPress={() => setScreen("home")}
              disabled={joinRoom.isPending}
            />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}
