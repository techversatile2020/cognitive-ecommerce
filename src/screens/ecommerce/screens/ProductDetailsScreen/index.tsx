import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { Images } from "../../../../config";
import { Counter } from "../../components";

export const ProductDetailsScreen = () => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const [liked, setLiked] = useState(false);

  return (
    <MainContainer>
      <MainHeader
        back
        title={"Product Details"}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      <View style={styles.imageViewContainer}>
        <View style={styles.imageView}>
          <CustomImage source={Images.printer} style={styles.printerImage} />
          <Pressable
            style={styles.heartIconView}
            onPress={() => setLiked((prev) => !prev)}
          >
            <CustomImage
              source={Images.heart}
              style={[styles.heartIcon, liked && { tintColor: "#FF5151" }]}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.infoSection}>
        <Text extraBold size={20}>
          $349.99
        </Text>
        <Text semiBold size={20} topSpacing={5}>
          Advantage DLX Printer
        </Text>
        <Text
          regular
          size={14}
          color="#868D94"
          topSpacing={5}
          bottomSpacing={10}
        >
          Model: DBD24/DBT24-2085-xxx
        </Text>
        {[1, 2, 3].map((item, index) => {
          return (
            <View style={styles.listText} key={index}>
              <View style={styles.dot} />
              <Text regular size={14} color="#868D94">
                Exceptional Ruggedness and Reliability
              </Text>
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Counter />
        <PrimaryButton title="Add to cart" customStyles={{ width: "47%" }} />
      </View>
    </MainContainer>
  );
};

const createStyles = (colors: typeof ThemeColors) =>
  StyleSheet.create({
    imageViewContainer: {
      height: SD.hp(350),
      backgroundColor: colors.lightBlue,
      padding: SD.wp(10),
      borderRadius: 14,
      marginTop: SD.hp(10),
    },
    imageView: {
      backgroundColor: colors.Base,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    printerImage: {
      width: "70%",
      height: "70%",
      resizeMode: "contain",
    },
    heartIconView: {
      width: SD.wp(45),
      height: SD.wp(45),
      borderRadius: 100,
      backgroundColor: colors.lightBlue,
      position: "absolute",
      top: 5,
      right: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    heartIcon: {
      width: SD.wp(21),
      height: SD.wp(21),
      resizeMode: "contain",
    },
    infoSection: {
      marginTop: SD.hp(20),
      paddingLeft: SD.wp(10),
      flex: 1,
    },
    listText: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: 10,
      marginTop: SD.hp(5),
    },
    dot: {
      width: SD.wp(5),
      height: SD.hp(5),
      borderRadius: 100,
      backgroundColor: "#868D94",
    },
  });
