import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { PrinterSetupStepsCard } from "./components";

const PrinterSetupScreen = ({ navigation }) => {
  const { AppTheme } = useTheme();
  const handleNext = () => {
    navigation.navigate(ScreenNames.SearchPrinterScreen);
  };
  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
      <Text medium size={14} right primartColor>
        Skip
      </Text>
      <View style={styles.section}>
        <Text bold size={24} centered color={AppTheme.Black}>
          Let’s Setup Your Printer
        </Text>
        <Text
          regular
          size={14}
          centered
          color={AppTheme.fontGray}
          topSpacing={8}
          bottomSpacing={8}
          leftSpacing={15}
          rightSpacing={15}
        >
          First we’ll pair your printer to you phone using bluetooth.
        </Text>
        <CustomImage source={Images.printer2} style={styles.printerImage} />
        <View style={styles.stepsSection}>
          <PrinterSetupStepsCard
            isActive={true}
            icon={Images.power}
            text="Turn on Printer"
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={false}
            icon={Images.bluetooth}
            text={"Connect to Bluetooth"}
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={false}
            icon={Images.wifi}
            text={"Connect to Wi-Fi"}
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={false}
            text={""}
            icon={Images.printerFilled}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Next"
          customStyles={styles.nextBtn}
          textColor="#FFFFFF"
          onPress={handleNext}
        />
        <Text primartColor centered semiBold size={14}>
          Watch Setup Video
        </Text>
      </View>
    </MainContainer>
  );
};

const VerticalLine = () => <View style={styles.verticalLine} />;

export default PrinterSetupScreen;
