import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainScreen } from "../screens";
import { ScreenNames } from "../config";
import { BottomTabScreenNames } from "../config/ScreenNames";

const Tab = createBottomTabNavigator();

const BottomTabScreens = [
  {
    id: 1,
    name: BottomTabScreenNames.Home,
    title: "Home",
    options: {},
    component: MainScreen,
  },
  {
    id: 2,
    name: BottomTabScreenNames.Cart,
    title: "Home",
    options: {},
    component: MainScreen,
  },
  {
    id: 3,
    name: BottomTabScreenNames.Orders,
    title: "Home",
    options: {},
    component: MainScreen,
  },
  {
    id: 4,
    name: BottomTabScreenNames.Profile,
    title: "Home",
    options: {},
    component: MainScreen,
  },
];

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ScreenNames.MainScreen}
    >
      {BottomTabScreens.map((item) => {
        return (
          <Tab.Screen
            name={item.name}
            component={item.component}
            key={item.id}
            options={{
              title: item.title,
              ...item.options,
            }}
          />
        );
      })}

      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};
