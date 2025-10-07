import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import {
  BackHeader,
  CustomTextInput,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { useTheme } from "../../../../hooks";
import { Images } from "../../../../config";
import { ProductCard } from "./ProductCard";

export const CartScreen = () => {
  const { AppTheme } = useTheme();
  const [promoCode, setPromoCode] = useState("");
  return (
    <MainContainer>
      <MainHeader
        back
        title={"Cart"}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {[1, 2, 3, 4].map((item) => {
          return (
            <ProductCard
              price={"$349.99"}
              title={"C Series"}
              model={"Model: WH-100XM4, Black"}
              image={Images.printer2}
              key={item}
              // containerStyle={styles.cardSpacing}
            />
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Text bold size={14}>
          Promo Code
        </Text>
        <View
          style={[styles.inputView, { backgroundColor: AppTheme.lightBlue }]}
        >
          <CustomTextInput
            containerStyles={styles.input}
            placeholder="Enter promo code here"
            value={promoCode}
            setValue={setPromoCode}
          />
          <Text regular size={12}>
            Apply
          </Text>
        </View>
        <Text bold size={14} topSpacing={20}>
          Order Summary
        </Text>
        <View
          style={[
            {
              backgroundColor: AppTheme.lightBlue,
              padding: SD.wp(20),
              borderRadius: 14,
              marginTop: SD.hp(10),
            },
          ]}
        >
          <TableText title="Order amount" value="$0" />
          <TableText title="Delivery fee" value="$0" />
          <TableText title="Coupon discount" value="$0" />
          <View style={styles.line} />
          <TableText title="Total" value="$0" bold />
        </View>
      </View>
      <PrimaryButton title="Checkout" />
    </MainContainer>
  );
};

const TableText = ({ title, value, bold }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: SD.hp(5),
      }}
    >
      <Text regular={!bold} blackBold={bold} size={12}>
        {title}
      </Text>
      <Text regular={!bold} blackBold={bold} size={12}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    height: SD.hp(60),
    marginVertical: SD.hp(10),
    padding: SD.wp(10),
  },
  input: {
    flex: 1,
    // width: "90%",
    height: "100%",
  },
  line: {
    width: "100%",
    height: SD.hp(1),
    backgroundColor: "#E1E1E1",
    marginVertical: SD.hp(10),
  },
  footer: {
    paddingTop: SD.hp(5),
  },
});
