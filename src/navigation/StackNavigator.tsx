import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationService, ScreenNames } from "../config";
import {
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
  ProductDetailsScreen,
} from "../screens";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { AuthScreenNames, BottomTabScreenNames } from "../config/ScreenNames";
import {
  ForgotPassword,
  LoginScreen,
  SignupScreen,
} from "../screens/authScreens";
import { EcommerceScreenNames } from "../config/ScreenNames";
import {
  CartScreen,
  FavouriteScreen,
  OrdersScreen,
  ProfileScreen,
} from "../screens/homeScreen";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();
export const StackNavigator = () => {
  const { token } = useSelector((state: any) => state.auth);
  console.log("token => ", token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen
            name={AuthScreenNames.LoginScreen}
            component={LoginScreen}
          />
          <Stack.Screen
            name={AuthScreenNames.SignupScreen}
            component={SignupScreen}
          />
          <Stack.Screen
            name={AuthScreenNames.ForgotPassword}
            component={ForgotPassword}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={ScreenNames.MainScreen}
            component={BottomTabNavigator}
          />
          <Stack.Screen name={ScreenNames.CartScreen} component={CartScreen} />
          <Stack.Screen
            name={ScreenNames.FavouriteScreen}
            component={FavouriteScreen}
          />
          <Stack.Screen
            name={ScreenNames.OrdersScreen}
            component={OrdersScreen}
          />
          <Stack.Screen
            name={ScreenNames.ProfileScreen}
            component={ProfileScreen}
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
          <Stack.Screen
            name={EcommerceScreenNames.ProductDetailsScreen}
            component={ProductDetailsScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
