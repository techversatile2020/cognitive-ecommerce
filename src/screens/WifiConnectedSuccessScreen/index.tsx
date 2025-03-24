import { ImageSourcePropType, View, ViewProps, ViewStyle } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { styles } from "./styles";
import { SD } from "../../utils";
import React from "react";
import { useTheme } from "../../hooks";
const WifiConnectedSuccessScreen = ({ route, navigation }) => {
  const isSuccess = route?.params?.isSuccess || false;
  const { AppTheme } = useTheme();

  const handleNext = () => {
    navigation.navigate(ScreenNames.PrinterConnectedSuccessScreen, {
      isSuccess,
    });
  };
  return (
    <MainContainer>
      <MainHeader back title="" />
      <Text bold size={30} centered>
        {isSuccess ? "Congratulations!" : "Unable to connect!"}
      </Text>
      <View style={styles.iconsView}>
        <CustomIcon icon={Images.buyPrinters} />
        <VerticalLine color={AppTheme.Primary} />
        <CustomImage
          source={isSuccess ? Images.tickGreen : Images.crossRed}
          style={styles.statusIcon}
        />
        <VerticalLine color={AppTheme.Primary} />
        <CustomIcon icon={Images.phone} />
        <Text regular size={20} color={AppTheme.fontGray} topSpacing={25}>
          {isSuccess ? "Printer successfully connected." : "Error Description"}
        </Text>
      </View>
      {isSuccess ? (
        <PrimaryButton title="Next" onPress={handleNext} />
      ) : (
        <View>
          <PrimaryButton
            title="Retry"
            customStyles={{ marginVertical: 0 }}
            onPress={handleNext}
          />
          <PrimaryButton title="Contact Support" />
        </View>
      )}
    </MainContainer>
  );
};

const VerticalLine = ({ color }) => (
  <View style={{ ...styles.verticalLine, backgroundColor: color }} />
);

type CustomIconProps = {
  icon: ImageSourcePropType;
  width?: number;
  height?: number;
  verticalSpacing?: number;
  [key: string]: any;
  iconContainerStyles?: ViewStyle;
};

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  width,
  height,
  verticalSpacing,
  iconContainerStyles,
  ...rest
}) => {
  return (
    <SectionContainer
      containerStyles={[
        styles.iconContainer,
        width && { width: SD.wp(width) },
        height && { height: SD.hp(height) },
        verticalSpacing && { marginVertical: SD.hp(verticalSpacing) },
        iconContainerStyles,
      ]}
    >
      <CustomImage source={icon} style={styles.icon} />
    </SectionContainer>
  );
};

export default WifiConnectedSuccessScreen;
