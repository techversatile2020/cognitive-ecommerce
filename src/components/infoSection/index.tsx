import React from "react";
import { View, StyleSheet, Image, ImageProps } from "react-native";
import { SectionContainer } from "../section-container";
import Text from "../text";
import { SD } from "../../utils";
import { useTheme } from "../../hooks";
import { Images } from "../../config";

interface InfoSectionProps {
  title: string;
  iconStyle?: object;
  innerContainerStyle?: object;
  containerStyle?: object;
  backgroundColor?: string;
  source?: ImageProps;
  onPress?: () => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  iconStyle,
  innerContainerStyle,
  containerStyle,
  source,
  onPress,
}) => {
  const { AppTheme } = useTheme();

  return (
    <SectionContainer
      containerStyles={[styles.sectionContainer, containerStyle]}
      onPress={onPress}
    >
      <View
        style={[
          styles.innerContainer,
          innerContainerStyle,
          {
            backgroundColor: AppTheme.Base,
          },
        ]}
      >
        {/* Icon Box with Image */}
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: AppTheme.lightBlue,
              justifyContent: "center",
              alignItems: "center",
            },
            iconStyle,
          ]}
        >
          <Image
            source={source}
            resizeMode="contain"
            style={[styles.iconStyles, { tintColor: AppTheme.Primary }]}
          />
        </View>

        {/* Title */}
        <Text bold size={16} leftSpacing={SD.wp(5)}>
          {title}
        </Text>
      </View>
    </SectionContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: SD.hp(10),
    paddingHorizontal: SD.wp(10),
    borderRadius: SD.wp(20),
  },
  innerContainer: {
    height: SD.hp(50),
    borderRadius: SD.wp(14),
    paddingHorizontal: SD.wp(10),
    padding: SD.wp(2),
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: SD.wp(38),
    height: SD.wp(38),
    borderRadius: SD.wp(20),
  },
  iconStyles: {
    width: SD.wp(20),
    height: SD.wp(20),
  },
});

export default InfoSection;
