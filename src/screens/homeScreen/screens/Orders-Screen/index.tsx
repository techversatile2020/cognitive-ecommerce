import React, { useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { MainContainer, MainHeader, Text } from "../../../../components";
import { OrderCard } from "../../../../components/OrderCard";
import { Images } from "../../../../config";
import { useTheme } from "../../../../hooks";
import { SD } from "../../../../utils";

export const OrdersScreen = () => {
  const { AppTheme } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [orders] = useState([
    {
      id: "#12458",
      price: "$349.99",
      productName: "Advantage DLX",
      status: "Delivered",
      date: "30 Sept 2025",
      imageSource: Images.printer,
    },
    {
      id: "#12459",
      price: "$199.99",
      productName: "Thermal 2000",
      status: "Pending",
      date: "2 Oct 2025",
      imageSource: Images.printer,
    },
    {
      id: "#12460",
      price: "$249.99",
      productName: "LaserJet Pro",
      status: "Delivered",
      date: "5 Oct 2025",
      imageSource: Images.printer,
    },
  ]);

  const routes = [
    { key: "all", title: "All" },
    { key: "delivered", title: "Delivered" },
    { key: "pending", title: "Pending" },
  ];

  const renderOrders = (filter: string) => {
    const filtered =
      filter === "All"
        ? orders
        : orders.filter((item) => item.status === filter);

    if (filtered.length === 0) {
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text>No {filter} Orders</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: SD.hp(20),
        }}
        renderItem={({ item }) => (
          <OrderCard
            orderId={item.id}
            price={item.price}
            productName={item.productName}
            status={item.status}
            date={item.date}
            imageSource={item.imageSource}
          />
        )}
      />
    );
  };

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "all":
        return renderOrders("All");
      case "delivered":
        return renderOrders("Delivered");
      case "pending":
        return renderOrders("Pending");
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
