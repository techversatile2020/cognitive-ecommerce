import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { CustomTouchable, Text } from "../../../../components";
import { useTheme } from "../../../../hooks";
import { SD } from "../../../../utils";

export const Counter = ({ containerStyles, counter, setCounter }: any) => {
  const { AppTheme } = useTheme();

  const handleIncrease = () => setCounter((prev) => prev + 1);
  const handleDecrease = () =>
    setCounter((prev) => (prev == 1 ? prev : prev - 1));
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: AppTheme.lightBlue },
        containerStyles,
      ]}
    >
      <CustomTouchable
        style={[styles.button, { backgroundColor: AppTheme.Base }]}
        onPress={handleDecrease}
      >
        <Text medium size={18}>
          -
        </Text>
      </CustomTouchable>
      <Text medium size={18}>
        {counter}
      </Text>
      <CustomTouchable
        onPress={handleIncrease}
        style={[styles.button, { backgroundColor: AppTheme.Primary }]}
      >
        <Text medium size={18} color={AppTheme.Base}>
          +
        </Text>
      </CustomTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SD.wp(5),
    width: "47%",
    borderRadius: 14,
    height: SD.hp(60),
  },
  button: {
    width: "35%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
