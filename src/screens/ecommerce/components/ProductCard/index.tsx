import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import { SD } from "../../../../utils";
import { CustomImage, Text } from "../../../../components";
import { Images, NavigationService } from "../../../../config";
import { EcommerceScreenNames } from "../../../../config/ScreenNames";

export const ProductCard = () => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const [liked, setLiked] = useState(false);

  const handleOnPress = () => {
    NavigationService.navigate(EcommerceScreenNames.ProductDetailsScreen);
  };

  return (
    <Pressable style={styles.container} onPress={handleOnPress}>
      <View style={styles.imageView}>
        <CustomImage source={Images.printer} style={styles.printerImage} />
        <Pressable
          style={styles.heartIconView}
          onPress={() => setLiked((prev) => !prev)}
        >
          <CustomImage
            source={Images.heart}
            style={[styles.printerImage, liked && { tintColor: "#FF5151" }]}
          />
        </Pressable>
      </View>
      <View style={styles.footerView}>
        <View>
          <Text size={14} regular>
            Product Name
          </Text>
          <Text size={14} bold topSpacing={5}>
            $349.99
          </Text>
        </View>
        <Pressable style={styles.cartIconView}>
          <CustomImage
            source={Images.Cart}
            style={[styles.printerImage, { tintColor: AppTheme.Primary }]}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: typeof ThemeColors) =>
  StyleSheet.create({
    container: {
      height: SD.hp(225),
      backgroundColor: colors.lightBlue,
      width: SD.wp(170),
      borderRadius: 14,
      padding: SD.wp(10),
    },
    imageView: {
      flex: 1,
      // height: "70%",
      backgroundColor: colors.Base,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    printerImage: {
      width: "60%",
      height: "60%",
      resizeMode: "contain",
    },
    heartIconView: {
      width: SD.wp(30),
      height: SD.wp(30),
      borderRadius: 100,
      backgroundColor: colors.lightBlue,
      position: "absolute",
      top: 5,
      right: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    footerView: {
      marginTop: SD.hp(10),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cartIconView: {
      width: SD.wp(30),
      height: SD.wp(30),
      borderRadius: 100,
      backgroundColor: colors.Base,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
    },
  });
