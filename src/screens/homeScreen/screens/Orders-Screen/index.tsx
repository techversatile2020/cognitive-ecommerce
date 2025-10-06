import { StyleSheet, FlatList } from "react-native";
import React from "react";
import { MainContainer, MainHeader, ProductCard } from "../../../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";

const accountOptions = [
  {
    id: "1",
    price: "$0.00",
    title: "Profile Settings",
    model: "Manage your personal information",
    image: Images.printer,
  },
  {
    id: "2",
    price: "$0.00",
    title: "Change Password",
    model: "Update your account credentials",
    image: Images.printer2,
  },
  {
    id: "4",
    price: "$0.00",
    title: "Logout",
    model: "Sign out from your account",
    image: Images.printerWithCheck,
  },
];

export const OrdersScreen = () => {
  const renderItem = ({ item }: any) => (
    <ProductCard
      price={item.price}
      title={item.title}
      model={item.model}
      image={item.image}
      containerStyle={styles.cardSpacing}
    />
  );

  return (
    <MainContainer>
      <MainHeader back title="Favorites" />

      <FlatList
        data={accountOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: SD.hp(10),
  },
  cardSpacing: {
    marginBottom: SD.hp(5),
  },
});
