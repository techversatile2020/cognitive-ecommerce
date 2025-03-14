import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import IconButton from "./components/UI/IconButton";
import AddPrinter from "./screens/AddPrinter";
import MainPage from "./screens/MainPage";
import Printer from "./screens/Printer";
import { Fonts } from "./src/styles";
import { Images, NavigationService } from "./src/config";
import { CustomImage, CustomTouchable } from "./src/components";
import { SD } from "./src/utils";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainPage"
            component={MainPage}
            options={({ navigation }) => ({
              title: "CognitiveTPG",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => navigation.navigate("AddPrinter")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPrinter"
            component={AddPrinter}
            options={({ navigation }) => ({
              title: "Add and configure a new printer",
              headerTitleStyle: { fontFamily: Fonts["Bold"] },
              headerLeft: ({ tintColor }) => (
                <CustomTouchable
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: SD.hp(35),
                    height: SD.hp(35),
                  }}
                >
                  <CustomImage
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    source={Images.BackBtn}
                  />
                </CustomTouchable>
                // <IconButton
                //   icon='arrow-back'
                //   size={24}
                //   color={tintColor}
                //   onPress={() => {
                //     navigation.goBack();
                //   }}
                // />
              ),
            })}
          />
          <Stack.Screen name="Printer" component={Printer} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
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
