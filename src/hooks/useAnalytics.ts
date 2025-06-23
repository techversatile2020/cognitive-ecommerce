// src/hooks/useAnalytics.ts
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = "c10ab648b95cf89b2a6f102f12e2be085";
let mixpanel: Mixpanel | null = null;

const initMixpanel = async () => {
  if (!mixpanel) {
    mixpanel = new Mixpanel(MIXPANEL_TOKEN, false);
    await mixpanel.init();
  }
};

export const useAnalytics = () => {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const setupAnalytics = async () => {
      await initMixpanel();
      mixpanel?.track("App Launched");

      const alreadyInstalled = await AsyncStorage.getItem("already_installed");
      if (!alreadyInstalled) {
        mixpanel?.track("App Installed");
        await AsyncStorage.setItem("already_installed", "true");
      }

      const currentVersion = DeviceInfo.getVersion();
      const storedVersion = await AsyncStorage.getItem("app_version");
      if (storedVersion !== currentVersion) {
        mixpanel?.track("App Updated");
        await AsyncStorage.setItem("app_version", currentVersion);
      }
    };

    setupAnalytics();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        startTimeRef.current = Date.now();
      } else if (
        nextAppState === "background" &&
        startTimeRef.current !== null
      ) {
        const duration = (Date.now() - startTimeRef.current) / 1000;
        mixpanel?.track("App Session Duration", { seconds: duration });
        startTimeRef.current = null;
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const track = (eventName: string, properties?: Record<string, any>) => {
    if (mixpanel) {
      mixpanel.track(eventName, properties);
    }
  };

  return {
    track,
  };
};
