import React from "react";
import { StyleSheet, View, Image } from "react-native";
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

export const OrdersScreen = () => {
  const { AppTheme } = useTheme();
  return (
    <MainContainer>
      <MainHeader back title="Orders" />

      <SectionContainer
        containerStyles={[
          styles.sectionContainer,
          {
            marginTop: SD.hp(8),
          },
        ]}
      >
        <CardContainer
          customStyles={[
            styles.cardContainer,
            { backgroundColor: AppTheme.Base },
          ]}
        >
          <View
            style={[
              styles.imageWrapper,
              { backgroundColor: AppTheme.lightBlue },
            ]}
          >
            <Image
              style={styles.image}
              source={Images.printer}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text
              bottomSpacing={5}
              color={AppTheme.lightGrayTextColor}
              size={10}
            >
              {"Order: #12458"}
            </Text>
            <Text bottomSpacing={3} color={AppTheme.Black} bold size={14}>
              {"$349.99"}
            </Text>
            <Text bottomSpacing={2} color={AppTheme.Black} medium size={14}>
              {"Advantage DLX"}
            </Text>
          </View>
        </CardContainer>
      </SectionContainer>
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
    width: "60%",
    height: SD.hp(60),
    justifyContent: "center",
  },
});
