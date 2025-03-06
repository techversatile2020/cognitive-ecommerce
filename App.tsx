import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import IconButton from "./components/UI/IconButton";
import AddPrinter from "./screens/AddPrinter";
import MainPage from "./screens/MainPage";
import Printer from "./screens/Printer";

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
            options={{
              title: "Add and configure a new printer",
            }}
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
