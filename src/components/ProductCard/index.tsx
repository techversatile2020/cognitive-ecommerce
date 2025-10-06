import {
  Image,
  StyleSheet,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SectionContainer } from "../section-container";
import { SD } from "../../utils";
import { useTheme } from "../../hooks";
import { CardContainer } from "../card-container";
import Text from "../text";
import { Images } from "../../config";

interface ProductCardProps {
  containerStyle?: object;
  price: string;
  title: string;
  model: string;
  image: ImageSourcePropType;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  containerStyle,
  price,
  title,
  model,
  image,
}) => {
  const { AppTheme } = useTheme();

  const COLORS = {
    base: AppTheme.Base,
    lightBlue: AppTheme.lightBlue,
    black: AppTheme.Black,
    grey: AppTheme.lightGrayTextColor,
  };

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
      <CardContainer
        customStyles={[styles.cardContainer, { backgroundColor: COLORS.base }]}
      >
        <View
          style={[styles.imageWrapper, { backgroundColor: COLORS.lightBlue }]}
        >
          <Image style={styles.image} source={image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <Text bottomSpacing={5} color={COLORS.black} bold size={14}>
            {price}
          </Text>
          <Text bottomSpacing={5} color={COLORS.black} medium size={14}>
            {title}
          </Text>
          <Text color={COLORS.grey} size={11}>
            {model}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.iconBox,
            {
              backgroundColor: AppTheme.lightBlue,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Image
            tintColor={AppTheme.Primary}
            source={Images.Cart}
            resizeMode="contain"
            style={styles.iconStyles}
          />
        </TouchableOpacity>
      </CardContainer>
    </SectionContainer>
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
    width: "60%",
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
});
