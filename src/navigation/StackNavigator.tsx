import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ScreenNames } from "../config";
import {
  MainScreen,
  AdvanceSettingScreen,
  CompletedScreen,
  ConnectToWifiPasswordScreen,
  ConnectWifiScreen,
  FactoryResetScreen,
  HttpServerWebView,
  MediaSettingScreen,
  NetworkInformationScreen,
  PrinterConnectedSuccessScreen,
  PrinterInfoScreen,
  PrinterSettingNested,
  PrinterSettingScreen,
  PrinterSetupScreen,
  SearchPrinterScreen,
  WifiConnectedSuccessScreen,
  ProductListingScreen,
} from "../screens";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { EcommerceScreenNames } from "../config/ScreenNames";

const Stack = createNativeStackNavigator();
export const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ScreenNames.MainScreen}
    >
      <Stack.Group>
        <Stack.Screen
          name={ScreenNames.MainScreen}
          component={BottomTabNavigator}
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

        <Stack.Screen
          name={EcommerceScreenNames.ProductListingScreen}
          component={ProductListingScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
