import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
import { NavigationService, ScreenNames } from "./src/config";
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
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./src/api";
import { StackNavigator } from "./src/navigation";

const queryClient = new QueryClient();

const App = () => {
  useAnalytics();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <>
              <StatusBar style="dark" />
              <NavigationContainer
                ref={(ref: any) => NavigationService.setTopLevelNavigator(ref)}
              >
                <StackNavigator />
              </NavigationContainer>
              <Toast />
            </>
          </ApolloProvider>
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
