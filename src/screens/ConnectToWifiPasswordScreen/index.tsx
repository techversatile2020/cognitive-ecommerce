import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  CustomImage,
  CustomTextInput,
  InfoFieldComp,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { useContext, useEffect, useState } from "react";
import { ConnectWifiRouter, SD, Toast } from "../../utils";
import { bin2String } from "../../utils/ble.util";
import { WifiContext } from "../ContextScreen";
import { toast } from "../../utils/toast.utils";
import { useDispatch, useSelector } from "react-redux";
const version_pb = require("./../../../protos/version_pb");
const request_pb = require("./../../../protos/request_pb");
const common_pb = require("./../../../protos/common_pb");
const response_pb = require("./../../../protos/response_pb");
const result_pb = require("./../../../protos/result_pb");

const ConnectToWifiPasswordScreen = ({ route, navigation }) => {
  const { AppTheme } = useTheme();
  const [routerName, setRouterName] = useState(route?.params?.wifi);
  const [wifiPassword, setWifiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(null);
  // const { connectedPrinters }: any = useContext(WifiContext);
  const { connectedPrinters } = useSelector((state: any) => state.printer);
  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (connectedPrinters?.length > 0) {
  //     let currentRouter = connectedPrinters?.filter(
  //       (router) =>
  //         router?.deviceStatus?.provisioningInfo?.ssid ===
  //         routerName?.getWifi().toObject().ssid
  //     );
  //     if (currentRouter?.length > 0) {
  //       toast.success(
  //         `Device connected to WIFI ${bin2String(
  //           routerName.getWifi().getSsid()
  //         )}`
  //       );
  //       navigation.navigate(ScreenNames.MainScreen);
  //     }
  //   }
  // }, [connectedPrinters]);

  const handleApply = async () => {
    try {
      await ConnectWifiRouter(routerName, wifiPassword, setLoading);
    } catch (error) {
      console.log("ConnectWifiRouter ERROR =>", error);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <SectionContainer containerStyles={styles.networkIconView}>
              <CustomImage
                source={Images.wifiRound}
                style={styles.networkIcon}
              />
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
                  value={
                    bin2String(routerName.getWifi().getSsid()) || "Xfinity"
                  }
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
            onPress={() => handleApply()}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

export default ConnectToWifiPasswordScreen;
