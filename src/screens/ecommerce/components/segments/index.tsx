import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import { CustomImage, Text } from "../../../../components";
import { SD } from "../../../../utils";
import { Images } from "../../../../config";

export const Segments = ({ data, handleChange }: any) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const [selectedSegment, setSelectedSegment] = useState(data[0]?.id);

  const handleChangeSegment = (e: any) => {
    setSelectedSegment(e);
    handleChange(e);
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{ flex: 1 }}
      horizontal
    >
      {/* <TouchableOpacity style={styles.filterIconContainer}>
        <CustomImage source={Images.filter} style={styles.filterIcon} />
      </TouchableOpacity> */}
      {data?.map((item, index) => {
        return (
          <SegmentCard
            data={item}
            key={index}
            onPress={handleChangeSegment}
            isSelected={item?.id == selectedSegment}
          />
        );
      })}
    </ScrollView>
  );
};

const SegmentCard = ({ onPress, data, isSelected }) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const { id, title } = data;
  return (
    <TouchableOpacity
      style={[
        styles.segmentCardContainer,
        // isSelected && { backgroundColor: AppTheme.Primary },
      ]}
      onPress={() => onPress(id)}
    >
      <Text
        size={12}
        medium
        // color={isSelected ? AppTheme.Base : AppTheme.Black}
      >
        {title}
      </Text>
      <CustomImage
        source={Images.arrowDown}
        style={[
          styles.arrowDownIcon,
          // isSelected && { tintColor: AppTheme.Base },
        ]}
      />
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof ThemeColors) =>
  StyleSheet.create({
    container: {
      //   flexDirection: "row",
      alignItems: "center",
      columnGap: 10,
      paddingBottom: SD.hp(5),
    },
    segmentCardContainer: {
      height: SD.hp(48),
      padding: SD.wp(10),
      backgroundColor: colors.lightBlue,
      borderRadius: 14,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      columnGap: 8,
    },
    arrowDownIcon: {
      width: SD.wp(14),
      height: SD.wp(7),
      resizeMode: "contain",
    },
    filterIconContainer: {
      height: SD.hp(48),
      justifyContent: "center",
      alignItems: "center",
      width: SD.wp(50),
      backgroundColor: ThemeColors.lightBlue,
      borderRadius: 14,
    },
    filterIcon: {
      width: "50%",
      height: "50%",
      resizeMode: "contain",
    },
  });
