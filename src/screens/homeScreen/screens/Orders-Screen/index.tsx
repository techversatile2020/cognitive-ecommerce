import React from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import {
  CardContainer,
  MainContainer,
  MainHeader,
  SectionContainer,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { useTheme } from "../../../../hooks";
import { Images } from "../../../../config";
import { OrderCard } from "../../../../components/OrderCard";

export const OrdersScreen = () => {
  const { AppTheme } = useTheme();
  return (
    <MainContainer>
      <MainHeader back title="Orders" />
      <OrderCard
        orderId="#12458"
        price="$349.99"
        productName="Advantage DLX"
        status="Delivered"
        date="30 Sept 2025"
        imageSource={Images.printer}
      />
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: SD.hp(10),
    paddingHorizontal: SD.wp(10),
    borderRadius: SD.wp(20),
  },
  cardContainer: {
    borderRadius: SD.hp(14),
    padding: SD.hp(7),
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    width: SD.hp(72),
    height: SD.hp(68),
    borderRadius: SD.hp(14),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SD.hp(50),
    height: SD.hp(50),
  },
  detailsContainer: {
    marginLeft: SD.wp(10),
    width: "45%",
    height: SD.hp(60),
    justifyContent: "center",
  },
  counter: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    // backgroundColor: "red",
    flex: 1,
    alignContent: "space-between",
    // height: "100%",
  },
  optionSelector: {
    width: SD.wp(20),
    height: SD.wp(20),
    borderColor: "#CECECE",
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  tickImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
    // tintColor: "#28CF6C",
    // backgroundColor: "red",
  },
});
