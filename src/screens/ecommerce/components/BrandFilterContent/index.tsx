import React from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SD } from "../../../../utils";
import { PrimaryButton, Text } from "../../../../components";

const brands = [
  "CognitiveTPG",
  "Epson",
  "Zebra",
  "Star Micronics",
  "Bixolon",
  "Brother",
  "Citizen",
];

export const BrandFilterContent = ({ selectedBrands = [], onSelect }) => {
  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      onSelect(selectedBrands.filter((b) => b !== brand));
    } else {
      onSelect([...selectedBrands, brand]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {brands.map((brand) => {
          const selected = selectedBrands.includes(brand);
          return (
            <TouchableOpacity
              key={brand}
              onPress={() => toggleBrand(brand)}
              style={[
                {
                  backgroundColor: selected ? "#E6EEFF" : "#F9F9F9",
                  borderWidth: selected ? 1.5 : 1,
                  borderColor: selected ? "#2C6BED" : "#DDD",
                },
                styles.optionsContainer,
              ]}
            >
              <Text
                style={{
                  color: selected ? "#2C6BED" : "#333",
                }}
              >
                {brand}
              </Text>
              {selected && (
                <Text style={{ color: "#2C6BED", marginLeft: SD.wp(5) }}>
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
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
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  optionsContainer: {
    borderRadius: 100,
    padding: SD.wp(10),
    margin: SD.wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
