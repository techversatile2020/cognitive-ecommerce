import React from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { SectionContainer } from "../section-container";
import { CardContainer } from "../card-container";
import { SD } from "../../utils";
import { Images } from "../../config";
import { useTheme } from "../../hooks";
import Text from "../text";
import { PrimaryButton } from "../primary-button";
import { styles } from "./OrderCard.styles";

interface OrderCardProps {
  orderId?: string;
  price?: string;
  productName?: string;
  status?: string;
  date?: string;
  imageSource?: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  orderId = "#12458",
  price = "$349.99",
  productName = "Advantage DLX",
  status = "Delivered",
  date = "25 Sept 2025",
  imageSource = Images.printer,
}) => {
  const { AppTheme } = useTheme();

  return (
    <SectionContainer
      containerStyles={[styles.sectionContainer, { marginTop: SD.hp(8) }]}
    >
      <CardContainer
        customStyles={[
          styles.cardContainer,
          { backgroundColor: AppTheme.Base },
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.imageWrapper,
              { backgroundColor: AppTheme.lightBlue },
            ]}
          >
            <Image
              style={styles.image}
              source={imageSource}
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
              {`Order: ${orderId}`}
            </Text>
            <Text bottomSpacing={2} size={14} bold color={AppTheme.Black}>
              {price}
            </Text>
            <Text medium size={14} color={AppTheme.Black}>
              {productName}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "85%",
              }}
            >
              <Pressable
                style={[styles.optionSelector, { backgroundColor: "#28CF6C" }]}
              >
                <Image source={Images.tick} style={styles.tickImage} />
              </Pressable>

              <Text size={10} color={AppTheme.lightGrayTextColor}>
                {status}
              </Text>
            </View>
            <Text size={10} color={AppTheme.lightGrayTextColor}>
              {date}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text underlined size={12} medium color={AppTheme.Black}>
              View Details
            </Text>
          </TouchableOpacity>
          <PrimaryButton
            fontSize={12}
            title="Re-order"
            customStyles={styles.reorderButton}
          />
        </View>
      </CardContainer>
    </SectionContainer>
  );
};
