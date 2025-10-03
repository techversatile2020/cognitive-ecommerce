import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";

export const ProductCard = () => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  return (
    <Pressable style={styles.container}>
      <Text>ProductCard</Text>
    </Pressable>
  );
};

const createStyles = (colors: typeof ThemeColors) => StyleSheet.create({});
