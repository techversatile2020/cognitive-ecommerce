import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemeColors } from "../../../../styles";
import { useTheme } from "../../../../hooks";
import { Colors } from "../../../../../constants/colors";
import { Images } from "../../../../config";
import { CustomTextInput } from "../../../../components";
import { SD } from "../../../../utils";

export const SearchBar = ({ search, setSearch }) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  return (
    <View style={[styles.container]}>
      <Image source={Images.Search} style={styles.searchIcon} />
      <CustomTextInput
        value={search}
        setValue={setSearch}
        placeholder="Search"
        containerStyles={{ flex: 1 }}
      />
    </View>
  );
};

const createStyles = (colors: typeof ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.lightBlue,
      //   flex: 1,
      padding: SD.wp(10),
      height: SD.hp(48),
      borderRadius: 20,
      marginVertical: SD.hp(10),
    },
    searchIcon: {
      width: SD.wp(24),
      height: SD.wp(24),
      resizeMode: "contain",
    },
  });
