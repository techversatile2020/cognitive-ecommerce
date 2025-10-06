import { StyleSheet, FlatList } from "react-native";
import React from "react";
import { MainContainer, MainHeader, ProductCard } from "../../../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";

const accountOptions = [
  {
    id: "1",
    price: "$349.99",
    title: "A776II-Retail Receipt...",
    model: "Model: WH-100XM4, Black",
    image: Images.printer,
  },
  {
    id: "2",
    price: "$349.99",
    title: "C Series",
    model: "Model: WH-100XM4, Black",
    image: Images.printer2,
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
