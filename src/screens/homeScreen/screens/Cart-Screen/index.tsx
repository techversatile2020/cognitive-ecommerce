// import {
//   Alert,
//   Animated,
//   Image,
//   Linking,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useCallback, useMemo, useRef, useState } from "react";
// import {
//   CustomTextInput,
//   Loader,
//   MainContainer,
//   MainHeader,
//   PrimaryButton,
//   SwipeableProductCard,
//   Text,
// } from "../../../../components";
// import { SD, Toast } from "../../../../utils";
// import { useTheme } from "../../../../hooks";
// import { ProductCard } from "./ProductCard";
// import { useCart } from "../../../../graphql";
// import { useFocusEffect } from "@react-navigation/native";
// import { Swipeable } from "react-native-gesture-handler";
// import { Images } from "../../../../config";

// export const CartScreen = () => {
//   const { AppTheme } = useTheme();
//   const [promoCode, setPromoCode] = useState("");
//   const [printers, setPrinters] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [checkoutUrl, setCheckoutUrl] = useState(null);
//   const [cartId, setCartId] = useState(null);
//   const [cartCost, setCartCost] = useState(null);
//   const [discountCodes, setDiscountCodes] = useState([]);

//   const { getCart, applyCouponCode } = useCart();

//   const handleApplyCoupon = async () => {
//     if (!cartId || !promoCode.trim()) return;
//     setIsLoading(true);

//     try {
//       const result = await applyCouponCode(cartId, promoCode.trim());
//       setIsLoading(false);

//       if (result.success) {
//         if (!result?.applicable) {
//           return Toast.fail("Coupon code is not applicable");
//         }
//         setDiscountCodes(result?.cart?.discountCodes || []);
//         setCartCost(result?.cart?.cost || {});

//         Toast.success("Coupon applied successfully!");
//       } else {
//         alert(result.error || "Invalid coupon code");
//       }
//     } catch (error) {
//       console.log("handleApplyCoupon:", error);
//       setIsLoading(false);
//     }
//   };

//   const reFetchCart = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getCart();
//       console.log("Cart Response:", response);
//       setCartId(response?.id);
//       setCheckoutUrl(response?.checkoutUrl);
//       setPrinters(response?.lines?.edges || []);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;

//       const fetchCartData = async () => {
//         try {
//           setIsLoading(true);
//           const response = await getCart();
//           console.log("Cart Response:", response);
//           if (!isActive) return;
//           console.log("response", response);
//           setCartId(response?.id);
//           setCheckoutUrl(response?.checkoutUrl);
//           setPrinters(response?.lines?.edges || []);
//         } catch (error) {
//           console.error("Error fetching cart:", error);
//         } finally {
//           if (isActive) setIsLoading(false);
//         }
//       };

//       fetchCartData();

//       return () => {
//         isActive = false;
//       };
//     }, [])
//   );

//   const orderSummary = useMemo(() => {
//     const subtotal = parseFloat(cartCost?.subtotalAmount?.amount || 0);
//     const total = parseFloat(cartCost?.totalAmount?.amount || 0);
//     const deliveryFee = subtotal > 0 ? 200 : 0;
//     const couponDiscount = subtotal - total;

//     return {
//       orderAmount: subtotal,
//       deliveryFee,
//       couponDiscount,
//       total: total + deliveryFee,
//     };
//   }, [cartCost, printers, discountCodes]);

//   const handleCheckout = () => {
//     if (checkoutUrl) {
//     }
//     Linking.openURL(checkoutUrl);
//   };

//   return (
//     <MainContainer>
//       <MainHeader
//         back
//         title={"Cart"}
//         headerTitleStyles={{
//           fontSize: SD.customFontSize(24),
//         }}
//       />
//       {printers?.length ? (
//         <View style={{ flex: 1 }}>
//           <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//             {printers?.map((item, index) => {
//               return (
//                 <SwipeableProductCard
//                   item={item}
//                   refetchCart={reFetchCart}
//                   ProductCard={ProductCard}
//                   cartId={cartId}
//                 />
//               );
//             })}
//           </ScrollView>
//           <View style={styles.footer}>
//             <Text bold size={14}>
//               Promo Code
//             </Text>
//             <View
//               style={[
//                 styles.inputView,
//                 { backgroundColor: AppTheme.lightBlue },
//               ]}
//             >
//               <CustomTextInput
//                 containerStyles={styles.input}
//                 placeholder="Enter promo code here"
//                 value={promoCode}
//                 setValue={setPromoCode}
//               />
//               <Text regular size={12} onPress={handleApplyCoupon}>
//                 Apply
//               </Text>
//             </View>
//             <Text bold size={14} topSpacing={20}>
//               Order Summary
//             </Text>
//             <View
//               style={[
//                 {
//                   backgroundColor: AppTheme.lightBlue,
//                   padding: SD.wp(20),
//                   borderRadius: 14,
//                   marginTop: SD.hp(10),
//                 },
//               ]}
//             >
//               <TableText
//                 title="Order amount"
//                 value={`${orderSummary?.orderAmount?.toFixed(2)}`}
//               />
//               <TableText
//                 title="Delivery fee"
//                 value={`${orderSummary?.deliveryFee?.toFixed(2)}`}
//               />
//               <TableText
//                 title="Coupon discount"
//                 value={`${orderSummary?.couponDiscount?.toFixed(2)}`}
//               />
//               <View style={styles.line} />
//               <TableText
//                 title="Total"
//                 value={`${orderSummary?.total?.toFixed(2)}`}
//                 bold
//               />
//             </View>
//           </View>
//           <PrimaryButton title="Checkout" onPress={handleCheckout} />
//         </View>
//       ) : (
//         <Text
//           centered
//           bold
//           size={22}
//           style={{
//             top: SD.hp(100),
//           }}
//         >
//           No cart item
//         </Text>
//       )}

//       <Loader visible={isLoading} text="Fetching cart items..." />
//     </MainContainer>
//   );
// };

// const TableText = ({ title, value, bold }: any) => {
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginVertical: SD.hp(5),
//       }}
//     >
//       <Text regular={!bold} blackBold={bold} size={12}>
//         {title}
//       </Text>
//       <Text regular={!bold} blackBold={bold} size={12}>
//         {value}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   inputView: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 14,
//     height: SD.hp(60),
//     marginVertical: SD.hp(10),
//     padding: SD.wp(10),
//   },
//   input: {
//     flex: 1,
//     // width: "90%",
//     height: "100%",
//   },
//   line: {
//     width: "100%",
//     height: SD.hp(1),
//     backgroundColor: "#E1E1E1",
//     marginVertical: SD.hp(10),
//   },
//   footer: {
//     paddingTop: SD.hp(5),
//   },
// });

import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CustomTextInput,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SwipeableProductCard,
  Text,
} from "../../../../components";
import { SD, Toast } from "../../../../utils";
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
  const [cartId, setCartId] = useState(null);
  const [cartCost, setCartCost] = useState(null);

  const { getCart, applyCouponCode } = useCart();

  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      const response = await getCart();
      console.log("response getCart ===>> ", response);

      if (!response) return;
      setCartId(response?.id);
      setCheckoutUrl(response?.checkoutUrl);
      setPrinters(response?.lines?.edges || []);
      setCartCost(response?.cost || {});
      setPromoCode(response?.discountCodes[0]?.code || "");
    } catch (error) {
      console.error("Error fetching cart:", error);
      Toast.fail("Failed to fetch cart");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [])
  );

  const handleApplyCoupon = async () => {
    if (!cartId || !promoCode.trim()) {
      Toast.fail("Please enter a coupon code");
      return;
    }
    setIsLoading(true);
    try {
      const result = await applyCouponCode(cartId, promoCode.trim());
      if (result?.success) {
        if (!result?.applicable) {
          Toast.fail("Coupon code is not applicable");
        } else {
          Toast.success("Coupon applied successfully!");
        }
        await fetchCartData(); // Refresh cart after coupon applied
      } else {
        Toast.fail(result?.error || "Invalid coupon code");
      }
    } catch (error) {
      console.log("handleApplyCoupon:", error);
      Toast.fail("Error applying coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (checkoutUrl) {
      Linking.openURL(checkoutUrl);
    } else {
      Toast.fail("Checkout not available");
    }
  };

  return (
    <MainContainer>
      <MainHeader
        back
        title="Cart"
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />

      {printers?.length ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {printers.map((item, index) => (
              <SwipeableProductCard
                key={item?.node?.id || index}
                item={item}
                refetchCart={fetchCartData}
                ProductCard={ProductCard}
                cartId={cartId}
              />
            ))}
          </ScrollView>

          {/* Coupon section */}
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
              <TouchableOpacity onPress={handleApplyCoupon}>
                <Text regular size={12} style={{ color: AppTheme.Primary }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
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
                value={`${cartCost?.subtotalAmount?.amount}`}
              />
              <TableText title="Delivery fee" value="0.00" />
              <Text size={8} color={AppTheme.Red}>
                *Delivery fee will be calculated after selecting payment method
                and entering address.
              </Text>

              {Number(cartCost?.totalDutyAmount?.amount) > 0 && (
                <TableText
                  title="Duty"
                  value={cartCost?.totalDutyAmount?.amount}
                />
              )}
              {Number(cartCost?.totalTaxAmount?.amount) > 0 && (
                <TableText
                  title="Tax"
                  value={cartCost?.totalTaxAmount?.amount}
                />
              )}

              <TableText
                title="Coupon discount"
                value={`-${
                  Number(cartCost?.subtotalAmount?.amount) -
                    Number(cartCost?.totalAmount?.amount) >
                  0
                    ? Number(cartCost?.subtotalAmount?.amount) -
                      Number(cartCost?.totalAmount?.amount)
                    : 0
                }`}
              />

              <View style={styles.line} />
              <TableText
                title="Total"
                value={`${cartCost?.totalAmount?.amount}`}
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

      <Loader visible={isLoading} text="Loading cart..." />
    </MainContainer>
  );
};

/** TableText subcomponent */
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
