import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks";
import { Loader, SectionContainer, Text } from "../../../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";
import { Counter } from "../../../ecommerce/components";
import { useCart } from "../../../../graphql";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProductCardProps {
  containerStyle?: object;
  model: string;
  data?: any;
  refetchCart?: any;
  sliding?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  containerStyle,
  model,
  data,
  refetchCart,
  sliding,
}) => {
  const { AppTheme } = useTheme();
  const { node } = data || {};
  const [quantity, setQuantity] = useState(1);
  const { updateCartLine } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQty) => {
    setIsLoading(true);
    try {
      const cartId = await AsyncStorage.getItem("cartId");
      if (!cartId) {
        console.warn("⚠️ No active cart found");
        return;
      }

      const updatedCart = await updateCartLine(cartId, node?.id, newQty);
      if (updatedCart) {
        // setQuantity(newQty);
        console.log("✅ Cart updated:", updatedCart);
        await refetchCart();
      } else {
        console.warn("⚠️ Cart update failed:", updatedCart);
      }
    } catch (err) {
      console.error("❌ Error updating cart:", err);
    } finally {
      setIsLoading(false); // ensures it always hides the loader
    }
  };
  const COLORS = {
    base: AppTheme.Base,
    lightBlue: AppTheme.lightBlue,
    black: AppTheme.Black,
    grey: AppTheme.lightGrayTextColor,
  };

  useEffect(() => {
    if (node?.quantity) {
      setQuantity(node?.quantity);
    } else {
      setQuantity((prev) => prev);
    }
  }, [node?.quantity]);

  return (
    <SectionContainer
      containerStyles={[
        styles.sectionContainer,
        containerStyle,
        {
          marginTop: SD.hp(8),
        },
      ]}
    >
      <View style={[styles.cardContainer]}>
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.imageWrapper, { backgroundColor: COLORS.base }]}>
            <Image
              style={styles.image}
              source={
                node?.merchandise?.product?.featuredImage
                  ? { uri: node?.merchandise?.product?.featuredImage?.url }
                  : Images.printer
              }
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text bottomSpacing={5} color={COLORS.black} bold size={14}>
              {/* {price} */}
              {node?.merchandise?.price?.currencyCode}
              {node?.merchandise?.price?.amount}
            </Text>
            <Text bottomSpacing={5} color={COLORS.black} medium size={14}>
              {/* {title} */}
              {node?.merchandise?.product?.title}
            </Text>
            <Text color={COLORS.grey} size={11}>
              {model}
            </Text>
          </View>
        </View>
        <View style={styles.counter}>
          <Counter
            containerStyles={{
              width: "70%",
              height: SD.hp(40),
            }}
            counter={quantity}
            setCounter={handleQuantityChange}
          />
        </View>
        <Loader visible={isLoading} />
      </View>
    </SectionContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: SD.hp(10),
    paddingHorizontal: SD.wp(10),
    borderRadius: SD.wp(20),
    height: SD.hp(100),
  },
  cardContainer: {
    borderRadius: SD.hp(14),
    padding: SD.hp(7),
    flexDirection: "row",
    justifyContent: "space-between",
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
    height: SD.hp(60),
    justifyContent: "center",
  },
  iconBox: {
    width: SD.wp(38),
    height: SD.wp(38),
    borderRadius: SD.wp(20),
  },
  iconStyles: {
    width: SD.wp(20),
    height: SD.wp(20),
  },
  counter: {
    alignItems: "flex-end",
    flex: 1,
    alignSelf: "flex-end",
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
  },
});
