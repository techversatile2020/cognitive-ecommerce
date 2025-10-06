import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { SectionContainer } from "../section-container";
import { SD } from "../../utils";
import { useTheme } from "../../hooks";
import { CardContainer } from "../card-container";
import { Images } from "../../config";
import Text from "../text";

interface InfoSectionProps {
  containerStyle?: object;
}

export const ProductCard: React.FC<InfoSectionProps> = ({ containerStyle }) => {
  const { AppTheme } = useTheme();

  const COLORS = {
    base: AppTheme.Base,
    lightBlue: AppTheme.lightBlue,
    black: AppTheme.Black,
    grey: AppTheme.lightGrayTextColor,
  };

  return (
    <SectionContainer
      containerStyles={[styles.sectionContainer, containerStyle]}
    >
      <CardContainer
        customStyles={[styles.cardContainer, { backgroundColor: COLORS.base }]}
      >
        <View
          style={[styles.imageWrapper, { backgroundColor: COLORS.lightBlue }]}
        >
          <Image style={styles.image} source={Images.printer} />
        </View>

        <View style={styles.detailsContainer}>
          <Text bottomSpacing={5} color={COLORS.black} bold size={14}>
            $349.99
          </Text>
          <Text bottomSpacing={5} color={COLORS.black} medium size={14}>
            A776II-Retail Receipt...
          </Text>
          <Text color={COLORS.grey} size={11}>
            Model: WH-100XM4, Black
          </Text>
        </View>
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
});
