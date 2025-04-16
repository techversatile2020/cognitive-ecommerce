import React, { createContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { ScreenNames } from "./src/config";

import {
  AdvanceSettingScreen,
  CompletedScreen,
  ConnectToWifiPasswordScreen,
  ConnectWifiScreen,
  FactoryResetScreen,
  HttpServerWebView,
  MainScreen,
  MediaSettingScreen,
  NetworkInformationScreen,
  PrinterConnectedSuccessScreen,
  PrinterInfoScreen,
  PrinterSettingNested,
  PrinterSettingScreen,
  PrinterSetupScreen,
  SearchPrinterScreen,
  WifiConnectedSuccessScreen,
} from "./src/screens";
import Toast from "react-native-toast-message";
import { WifiScannedDevicesProvider } from "./src/screens/ContextScreen";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    // <WifiScannedDevicesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <>
            <StatusBar style="dark" />

            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name={ScreenNames.MainScreen}
                  component={MainScreen}
                />
                <Stack.Screen
                  name={ScreenNames.PrinterSetupScreen}
                  component={PrinterSetupScreen}
                />
                <Stack.Screen
                  name={ScreenNames.SearchPrinterScreen}
                  component={SearchPrinterScreen}
                />
                <Stack.Screen
                  name={ScreenNames.ConnectWifiScreen}
                  component={ConnectWifiScreen}
                />
                <Stack.Screen
                  name={ScreenNames.PrinterConnectedSuccessScreen}
                  component={PrinterConnectedSuccessScreen}
                />
                <Stack.Screen
                  name={ScreenNames.PrinterSettingScreen}
                  component={PrinterSettingScreen}
                />
                <Stack.Screen
                  name={ScreenNames.NetworkInformationScreen}
                  component={NetworkInformationScreen}
                />
                <Stack.Screen
                  name={ScreenNames.PrinterSettingNested}
                  component={PrinterSettingNested}
                />
                <Stack.Screen
                  name={ScreenNames.MediaSettingScreen}
                  component={MediaSettingScreen}
                />
                <Stack.Screen
                  name={ScreenNames.PrinterInfoScreen}
                  component={PrinterInfoScreen}
                />
                <Stack.Screen
                  name={ScreenNames.AdvanceSettingScreen}
                  component={AdvanceSettingScreen}
                />
                <Stack.Screen
                  name={ScreenNames.ConnectToWifiPasswordScreen}
                  component={ConnectToWifiPasswordScreen}
                />
                <Stack.Screen
                  name={ScreenNames.FactoryResetScreen}
                  component={FactoryResetScreen}
                />
                <Stack.Screen
                  name={ScreenNames.CompletedScreen}
                  component={CompletedScreen}
                />
                <Stack.Screen
                  name={ScreenNames.WifiConnectedSuccessScreen}
                  component={WifiConnectedSuccessScreen}
                />
                <Stack.Screen
                  name={ScreenNames.HttpServerWebVIew}
                  component={HttpServerWebView}
                />
              </Stack.Navigator>
            </NavigationContainer>

            <Toast />
          </>
        </QueryClientProvider>
      </PersistGate>
    </Provider>

    // </WifiScannedDevicesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 48,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
