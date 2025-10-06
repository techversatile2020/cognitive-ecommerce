import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainScreen } from "../screens";
import { Images, ScreenNames } from "../config";
import { BottomTabScreenNames } from "../config/ScreenNames";
import { Image, StyleSheet, View } from "react-native";
import { SD } from "../utils";
import { Colors } from "../../constants/colors";
import { useTheme } from "../hooks";
import { Text } from "../components";
import {
  CartScreen,
  FavouriteScreen,
  OrdersScreen,
  ProfileScreen,
} from "../screens/homeScreen";

const Tab = createBottomTabNavigator();

const BottomTabScreens = [
  {
    id: 1,
    name: BottomTabScreenNames.Home,
    title: "Home",
    options: {},
    component: MainScreen,
    Icon: Images.Home,
  },
  {
    id: 2,
    name: BottomTabScreenNames.Cart,
    title: "Cart",
    options: {},
    component: CartScreen,
    Icon: Images.Cart,
  },
  {
    id: 3,
    name: BottomTabScreenNames.Orders,
    title: "Orders",
    options: {},
    component: OrdersScreen,
    Icon: Images.Orders,
  },
  {
    id: 4,
    name: BottomTabScreenNames.favourite,
    title: "Favourites",
    options: {},
    component: FavouriteScreen,
    Icon: Images.heartOutlined,
  },
  {
    id: 5,
    name: BottomTabScreenNames.Profile,
    title: "Profile",
    options: {},
    component: ProfileScreen,
    Icon: Images.Profile,
  },
];

export const BottomTabNavigator = () => {
  const { AppTheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: SD.hp(90),
          paddingTop: SD.hp(15),
        },
      }}
      initialRouteName={ScreenNames.MainScreen}
    >
      {BottomTabScreens.map((item) => {
        return (
          <Tab.Screen
            name={item.name}
            component={item.component}
            key={item.id}
            options={{
              // title: item.title,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => (
                <View style={styles.tabBarItemView}>
                  <Image
                    source={item.Icon}
                    style={[
                      styles.bottomIcon,
                      {
                        tintColor: focused
                          ? AppTheme.fontBlueL
                          : AppTheme.Black,
                      },
                    ]}
                  />
                  <Text
                    bold
                    size={10.48}
                    topSpacing={5}
                    color={focused ? AppTheme.fontBlueL : AppTheme.Black}
                  >
                    {item.title}
                  </Text>
                </View>
              ),
              ...item.options,
            }}
          />
        );
      })}

      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomIcon: {
    width: SD.wp(24),
    height: SD.wp(24),
    resizeMode: "contain",
  },
  tabBarItemView: {
    justifyContent: "center",
    alignItems: "center",
  },
});
