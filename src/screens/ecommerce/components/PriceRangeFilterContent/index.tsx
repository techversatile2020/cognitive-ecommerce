import React, { useState } from "react";
import { View } from "react-native";
import Slider from "@react-native-community/slider";
import { PrimaryButton, Text } from "../../../../components";
import { useTheme } from "../../../../hooks";

export const PriceRangeFilterContent = ({
  minLimit = 0,
  maxLimit = 10000,
  initialRange = { min: 0, max: 1000 },
  onApply,
}) => {
  const { AppTheme } = useTheme();
  const [range, setRange] = useState({
    min: initialRange.min || minLimit,
    max: initialRange.max || maxLimit,
  });

  const handleApply = () => {
    onApply(range);
  };

  return (
    <View style={{ paddingVertical: 24, gap: 20 }}>
      <Text centered bold>
        Select Price Range
      </Text>

      <View style={{ alignItems: "center" }}>
        <Text centered>
          ${range.min.toFixed(0)} - ${range.max.toFixed(0)}
        </Text>
      </View>

      {/* --- Min Slider --- */}
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ marginBottom: 4, color: "#555" }}>Minimum Price</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={minLimit}
          maximumValue={range.max}
          step={500}
          minimumTrackTintColor={AppTheme.Primary}
          maximumTrackTintColor="#DDD"
          thumbTintColor={AppTheme.Primary}
          value={range.min}
          onValueChange={(val) => setRange((prev) => ({ ...prev, min: val }))}
        />
      </View>

      {/* --- Max Slider --- */}
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ marginBottom: 4, color: "#555" }}>Maximum Price</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={range.min}
          maximumValue={maxLimit}
          step={500}
          minimumTrackTintColor={AppTheme.Primary}
          maximumTrackTintColor="#DDD"
          thumbTintColor={AppTheme.Primary}
          value={range.max}
          onValueChange={(val) => setRange((prev) => ({ ...prev, max: val }))}
        />
      </View>

      <PrimaryButton title="Apply" onPress={handleApply} />
    </View>
  );
};
