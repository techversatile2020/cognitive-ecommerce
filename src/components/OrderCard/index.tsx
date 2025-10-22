import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SectionContainer } from "../section-container";
import { SD, Toast } from "../../utils";
import { Images } from "../../config";
import { useTheme } from "../../hooks";
import Text from "../text";
import { PrimaryButton } from "../primary-button";
import { styles } from "./OrderCard.styles";
import moment from "moment";
import { useCart } from "../../graphql";
import Loader from "../Loader";

interface OrderCardProps {
  data?: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({ data }) => {
  const { AppTheme } = useTheme();
  const { node } = data || {};
  const [productInfo, setProductInfo]: any = useState({});
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    let quantity = productInfo?.quantity || 1;
    let variantId = productInfo?.variant?.id;
    let response = await addToCart({
      variantId,
      quantity,
    });
    if (response?.id) {
      Toast.success("Item added to cart");
    }
  };

  useEffect(() => {
    setProductInfo(node?.lineItems?.edges[0]?.node);
  }, [node]);

  return (
    <SectionContainer
      containerStyles={[styles.sectionContainer, { marginTop: SD.hp(8) }]}
    >
      <View style={[styles.cardContainer]}>
        <View style={styles.topRow}>
          <View
            style={[styles.imageWrapper, { backgroundColor: AppTheme.Base }]}
          >
            <Image
              style={styles.image}
              source={
                productInfo?.variant?.image
                  ? { uri: productInfo?.variant?.image?.src }
                  : Images.printer
              }
              resizeMode="contain"
            />
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text
              bottomSpacing={8}
              size={10}
              color={AppTheme.lightGrayTextColor}
            >
              {`Order: ${node?.name}`}
            </Text>
            <Text bottomSpacing={2} size={14} bold color={AppTheme.Black}>
              {/* {price} */}
              {productInfo?.variant?.price?.currencyCode}{" "}
              {productInfo?.variant?.price?.amount}
            </Text>
            <Text medium size={14} color={AppTheme.Black}>
              {productInfo?.title}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View>
              {/* <Pressable
                style={[styles.optionSelector, { backgroundColor: "#28CF6C" }]}
              >
                <Image source={Images.tick} style={styles.tickImage} />
              </Pressable> */}

              <Text size={10} color={AppTheme.lightGrayTextColor} right>
                {/* {status} */}
                {node?.fulfillmentStatus}
              </Text>
            </View>
            <Text size={10} color={AppTheme.lightGrayTextColor}>
              {/* {date} */}
              {moment(node?.processedAt).format("DD MMM YYYY")}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.viewDetailsButtonRtles}
            activeOpacity={0.7}
          >
            <Text size={12} medium color={AppTheme.Black}>
              View Details
            </Text>
          </TouchableOpacity>
          <PrimaryButton
            fontSize={12}
            title="Re-order"
            customStyles={styles.reorderButton}
            onPress={handleAddToCart}
          />
        </View>
      </View>
      <Loader visible={loading} fullScreen />
    </SectionContainer>
  );
};
