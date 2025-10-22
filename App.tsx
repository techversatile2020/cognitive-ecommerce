import { ApolloProvider } from "@apollo/client/react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { client } from "./src/api";
import { NavigationService } from "./src/config";
import { useAnalytics } from "./src/hooks";
import { StackNavigator } from "./src/navigation";
import { persistor, store } from "./src/redux";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

const App = () => {
  useAnalytics();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <>
              <StatusBar style="dark" />
              <NavigationContainer
                ref={(ref: any) => NavigationService.setTopLevelNavigator(ref)}
              >
                <GestureHandlerRootView>
                  <StackNavigator />
                </GestureHandlerRootView>
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
