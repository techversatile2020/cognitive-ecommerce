import { ApolloProvider } from "@apollo/client/react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { client } from "./src/api";
import { NavigationService } from "./src/config";
import { useAnalytics } from "./src/hooks";
import { StackNavigator } from "./src/navigation";
import { persistor, store } from "./src/redux";

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
