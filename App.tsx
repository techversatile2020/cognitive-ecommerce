import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
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
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { WifiScannedDevicesProvider } from "./src/screens/ContextScreen";
import { store, persistor } from "./src/redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Mixpanel } from "mixpanel-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { useAnalytics } from "./src/hooks";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  useAnalytics();
  return (
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
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
