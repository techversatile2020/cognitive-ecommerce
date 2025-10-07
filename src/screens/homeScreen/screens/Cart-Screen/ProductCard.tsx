import {
  Image,
  StyleSheet,
  View,
  ImageSourcePropType,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../hooks";
import { CardContainer, SectionContainer, Text } from "../../../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";
import { Counter } from "../../../ecommerce/components";

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
  const [selected, setSelected] = useState(true);
  const COLORS = {
    base: AppTheme.Base,
    lightBlue: AppTheme.lightBlue,
    black: AppTheme.Black,
    grey: AppTheme.lightGrayTextColor,
  };

  const handleSelected = () => setSelected((prev) => !prev);
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
        <View style={{ flexDirection: "row" }}>
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
            {/* <Text color={COLORS.grey} size={11}>
              {model}
            </Text> */}
          </View>
        </View>
        <View style={styles.counter}>
          <Pressable
            style={[
              styles.optionSelector,
              selected && { backgroundColor: "#28CF6C" },
            ]}
            onPress={handleSelected}
          >
            {selected && (
              <Image source={Images.tick} style={styles.tickImage} />
            )}
          </Pressable>
          <Counter
            containerStyles={{
              width: "70%",
              height: SD.hp(40),
            }}
          />
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
    // marginVertical: SD.hp(10),
  },
  cardContainer: {
    borderRadius: SD.hp(14),
    padding: SD.hp(7),
    flexDirection: "row",
    // alignItems: "center",
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
    width: "30%",
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
