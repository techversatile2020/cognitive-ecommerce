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
const ConnectToWifiPasswordScreen = ({ route, navigation }) => {
  const { AppTheme } = useTheme();
  // const navigation = useNavigation();
  const [routerName, setRouterName] = useState(route?.params?.router);
  const [wifiPassword, setWifiPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleApply = () => {
    return navigation.navigate(ScreenNames.WifiConnectedSuccessScreen, {
      isSuccess: routerName?.id == "3",
    });
    route?.params?.onGoBack(routerName);
    navigation.goBack();
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
              value={routerName?.name || "Xfinity"}
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
