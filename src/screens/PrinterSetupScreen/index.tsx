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
import { BLEService } from "../../../services";
import { toast } from "../../utils/toast.utils";

const PrinterSetupScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const isSuccess = route?.params?.isSuccess || false;
  const handleNext = async () => {
    if (isSuccess) {
      return navigation.replace(ScreenNames.MainScreen);
    }
    try {
      await BLEService.initializeBLE();
      navigation.navigate(ScreenNames.SearchPrinterScreen);
    } catch (error) {
      console.log("Error => ", error);

      toast.fail("Fail", error?.message || "Check your bluetooth!!!");
    }
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
          {isSuccess
            ? `Your printer connection has been established`
            : `First we’ll pair your printer to you phone using bluetooth.`}
        </Text>
        <CustomImage
          source={isSuccess ? Images.printerWithClip : Images.printer2}
          style={styles.printerImage}
        />
        <View style={styles.stepsSection}>
          <PrinterSetupStepsCard
            isActive={true}
            icon={Images.power}
            text="Turn on Printer"
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={isSuccess}
            icon={Images.bluetooth}
            text={"Connect to Bluetooth"}
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={isSuccess}
            icon={Images.wifi}
            text={"Connect to Wi-Fi"}
          />
          <VerticalLine />
          <PrinterSetupStepsCard
            isActive={isSuccess}
            text={""}
            icon={Images.printerFilled}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={isSuccess ? "Finish setup" : "Next"}
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
