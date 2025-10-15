import React, { useEffect, useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { MainContainer, MainHeader, Text } from "../../../../components";
import { OrderCard } from "../../../../components/OrderCard";
import { Images } from "../../../../config";
import { useTheme } from "../../../../hooks";
import { SD } from "../../../../utils";
import { useOrders } from "../../../../graphql";
import { useSelector } from "react-redux";

export const OrdersScreen = () => {
  const { AppTheme } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { getOrders, orders: ordersData } = useOrders();
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    getOrders(token);
  }, [token]);

  const routes = [
    { key: "all", title: "All" },
    { key: "unfulfilled", title: "Unfulfilled" },
    { key: "fulfilled", title: "Fulfilled" },
  ];

  const renderOrders = (filter: string) => {
    const filtered =
      filter === "All"
        ? ordersData
        : ordersData.filter((item) => {
            return (
              item?.node?.fulfillmentStatus?.toLowerCase() ==
              filter?.toLowerCase()
            );
          });

    if (filtered.length === 0) {
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text>No {filter} Orders</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: SD.hp(20),
        }}
        renderItem={({ item }) => <OrderCard data={item} />}
      />
    );
  };

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "all":
        return renderOrders("All");
      case "fulfilled":
        return renderOrders("Fulfilled");
      case "unfulfilled":
        return renderOrders("Unfulfilled");
      default:
        return null;
    }
  };

  return (
    <MainContainer>
      <MainHeader back title="Orders" />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: AppTheme?.Primary || "black",
              height: 2,
              borderRadius: 2,
            }}
            style={{ backgroundColor: "white" }}
            inactiveColor={AppTheme.Black}
            activeColor={AppTheme?.Primary || "black"}
            pressColor="transparent"
          />
        )}
      />
    </MainContainer>
  );
};
