import React from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SD } from "../../../../utils";
import { PrimaryButton, Text } from "../../../../components";
import { useTheme } from "../../../../hooks";

const categories = [
  "Receipt Printers",
  "Label Printers",
  "POS Printers",
  "Thermal Printers",
  "Portable Printers",
  "Kiosk Printers",
];

export const CategoryFilterContent = ({ selectedCategory, onSelect }) => {
  const { AppTheme } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.optionsContainer,
              {
                backgroundColor:
                  selectedCategory === item ? "#E6EEFF" : "#F9F9F9",
                borderWidth: selectedCategory === item ? 1.5 : 1,
                borderColor:
                  selectedCategory === item ? AppTheme.Primary : "#DDD",
              },
            ]}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <PrimaryButton
        title="Apply"
        onPress={() => null}
        customStyles={{ bottom: SD.hp(20) }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  optionsContainer: {
    padding: SD.wp(10),
    borderRadius: 100,
    margin: SD.wp(5),
  },
});
