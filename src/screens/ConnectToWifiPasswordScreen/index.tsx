import { View } from "react-native";
import {
  CustomImage,
  CustomTextInput,
  InfoFieldComp,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { useEffect, useState } from "react";
import { SD } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { BLEService } from "../../../services";
import Toast from "react-native-toast-message";
const ConnectToWifiPasswordScreen = ({ route, navigation }) => {
  const { AppTheme } = useTheme();
  // const navigation = useNavigation();
  const [routerName, setRouterName] = useState(route?.params?.wifi);
  const [wifiPassword, setWifiPassword] = useState("Swift@2020");
  const [showPassword, setShowPassword] = useState(false);

  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleApply = async () => {
    // return navigation.navigate(ScreenNames.WifiConnectedSuccessScreen, {
    //   isSuccess: routerName?.id == "3",
    // });
    // Swift@2020 <-- wifi password
    // route?.params?.onGoBack(routerName);
    // navigation.goBack();
    if (!wifiPassword)
      return Toast.show({ type: "error", text1: "Please enter wifi password" });
    try {
      let device = await BLEService.connectAndSendWifi(
        routerName,
        wifiPassword
      );
      console.log("WIFI SENDED => ", device);
      console.log("DEVIE ->", BLEService.device);
    } catch (error) {
      console.log("Connect wifi password screen => ", error);
    }
  };
  return (
    <MainContainer>
      <MainHeader
        back
        title="Network Information"
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <View style={styles.container}>
        <SectionContainer containerStyles={styles.networkIconView}>
          <CustomImage source={Images.wifiRound} style={styles.networkIcon} />
        </SectionContainer>
        <Text
          bold
          size={18}
          color={AppTheme.Black}
          centered
          width={281}
          topSpacing={15}
          bottomSpacing={15}
        >
          Enter password for the selected WiFi network
        </Text>
        <InfoFieldComp
          title="Router Name"
          children={
            <CustomTextInput
              placeholder="Router Name"
              value={routerName || "Xfinity"}
              setValue={(e) => setRouterName(e)}
              backgroundColor={AppTheme.White}
              placeholderTextColor={AppTheme.fontGray}
              bold
              fontSize={12}
              textColor={AppTheme.fontGray}
              topSpacing={10}
              radius={10}
              height={50}
              //   style={{ padding: SD.wp(15) }}
              disable={true}
            />
          }
        />
        <InfoFieldComp
          title="Password"
          children={
            <CustomTextInput
              placeholder="Enter Password"
              value={wifiPassword}
              setValue={(e) => setWifiPassword(e)}
              backgroundColor={AppTheme.White}
              placeholderTextColor={AppTheme.fontGray}
              bold
              fontSize={12}
              textColor={AppTheme.fontGray}
              topSpacing={10}
              radius={10}
              height={50}
              //   style={{ padding: SD.wp(15) }}
              secureText={showPassword}
              icon={showPassword ? Images.eye : Images.eyeClose}
              onIconPress={handleTriggerShowPassword}
            />
          }
        />
      </View>
      <PrimaryButton
        title="Apply"
        customStyles={{ borderRadius: 15 }}
        onPress={handleApply}
      />
    </MainContainer>
  );
};

export default ConnectToWifiPasswordScreen;
