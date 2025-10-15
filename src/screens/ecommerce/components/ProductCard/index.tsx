import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import { SD } from "../../../../utils";
import { CustomImage, Text } from "../../../../components";
import { Images, NavigationService } from "../../../../config";
import { EcommerceScreenNames } from "../../../../config/ScreenNames";
import { useFavorites } from "../../../../graphql";
import { useSelector } from "react-redux";

export const ProductCard = ({ data }: any) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const { addFavorite, getFavorites } = useFavorites();
  const { token } = useSelector((state: any) => state.auth);
  const [liked, setLiked] = useState(false);
  const { node } = data || {};
  const [price, setPrice]: any = useState(0);
  const handleOnPress = () => {
    NavigationService.navigate(EcommerceScreenNames.ProductDetailsScreen, {
      id: node?.id,
    });
  };

  useEffect(() => {
    setPrice(node?.variants?.edges[0]?.node);
  }, [node]);

  const handleFavorites = async () => {
    try {
      await addFavorite(token, node?.id);
    } catch (error) {
      console.log("handleFavorites: ", error);
    }
  };
  return (
    <Pressable style={styles.container} onPress={handleOnPress}>
      <View style={styles.imageView}>
        <CustomImage
          source={
            node?.images
              ? { uri: node?.images?.edges[0]?.node?.originalSrc }
              : Images.printer
          }
          style={styles.printerImage}
        />
        <Pressable
          style={styles.heartIconView}
          onPress={() => {
            handleFavorites();
            setLiked((prev) => !prev);
          }}
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
            {node?.title}
          </Text>
          <Text size={14} bold topSpacing={5}>
            {price?.priceV2?.currencyCode} {price?.priceV2?.amount}
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
      // backgroundColor: colors.Base,
      // borderRadius: 14,
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
