import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MainContainer, MainHeader, ProductCard } from "../../../../components";

export const OrdersScreen = () => {
  return (
    <MainContainer>
      <MainHeader back title="Favorites" />
      <ProductCard />
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
