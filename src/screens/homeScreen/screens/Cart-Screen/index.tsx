import { Linking, ScrollView, StyleSheet, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  CustomTextInput,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { useTheme } from "../../../../hooks";
import { ProductCard } from "./ProductCard";
import { useCart } from "../../../../graphql";
import { useFocusEffect } from "@react-navigation/native";

export const CartScreen = () => {
  const { AppTheme } = useTheme();
  const [promoCode, setPromoCode] = useState("");
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const { getCart, refetch } = useCart();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCartData = async () => {
        try {
          setIsLoading(true);
          const response = await getCart();
          console.log("Cart Response:", response);
          if (!isActive) return;

          setCheckoutUrl(response?.checkoutUrl);
          setPrinters(response?.lines?.edges || []);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchCartData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const orderSummary = useMemo(() => {
    const orderAmount = printers?.reduce((sum, item) => {
      const price = parseFloat(item?.node?.merchandise?.price?.amount || 0);
      const quantity = item?.node?.quantity || 0;
      return sum + price * quantity;
    }, 0);

    const deliveryFee = orderAmount > 0 ? 200 : 0;
    const couponDiscount = promoCode ? orderAmount * 0.1 : 0;
    const total = orderAmount + deliveryFee - couponDiscount;

    return {
      orderAmount,
      deliveryFee,
      couponDiscount,
      total,
    };
  }, [printers, promoCode]);

  const handleCheckout = () => {
    if (checkoutUrl) {
    }
    Linking.openURL(checkoutUrl);
  };

  return (
    <MainContainer>
      <MainHeader
        back
        title={"Cart"}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      {printers?.length ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {printers?.map((item, index) => {
              return (
                <ProductCard
                  model={"Model: WH-100XM4, Black"}
                  key={item?.node?.id}
                  data={item}
                  refetchCart={refetch}
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
              style={[
                styles.inputView,
                { backgroundColor: AppTheme.lightBlue },
              ]}
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
              <TableText
                title="Order amount"
                value={`${orderSummary?.orderAmount?.toFixed(2)}`}
              />
              <TableText
                title="Delivery fee"
                value={`${orderSummary?.deliveryFee?.toFixed(2)}`}
              />
              <TableText
                title="Coupon discount"
                value={`${orderSummary?.couponDiscount?.toFixed(2)}`}
              />
              <View style={styles.line} />
              <TableText
                title="Total"
                value={`${orderSummary?.total?.toFixed(2)}`}
                bold
              />
            </View>
          </View>
          <PrimaryButton title="Checkout" onPress={handleCheckout} />
        </View>
      ) : (
        <Text
          centered
          bold
          size={22}
          style={{
            top: SD.hp(100),
          }}
        >
          No cart item
        </Text>
      )}

      <Loader visible={isLoading} text="Fetching cart items..." />
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
