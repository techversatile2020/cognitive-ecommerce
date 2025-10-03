import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import { CustomImage, MainContainer, MainHeader } from "../../../../components";
import { SD } from "../../../../utils";
import { Images } from "../../../../config";

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
  });
