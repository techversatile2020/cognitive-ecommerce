import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  ConnectionStatusModal,
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
import { Images } from "../../config";
import { useAnalytics, useTheme } from "../../hooks";
import { useEffect, useState } from "react";
import { ConnectWifiRouter } from "../../utils";
import { bin2String } from "../../utils/ble.util";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../redux/reducers";

const ConnectToWifiPasswordScreen = ({ route }) => {
  const { AppTheme } = useTheme();
  const [routerName, setRouterName] = useState(route?.params?.wifi);
  const { error } = useSelector((state: any) => state?.printer);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [wifiPassword, setWifiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(null);
  const { track } = useAnalytics();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && error) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error, loading]);

  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleApply = async () => {
    try {
      track("Provisioning Started", {
        screen: "ConnectToWifiPasswordScreen",
        router: bin2String(routerName.getWifi().getSsid()),
      });

      await ConnectWifiRouter(routerName, wifiPassword, setLoading);
    } catch (error) {
      console.log("ERROR CONNECTING => ", error);
    }
  };

  const handleOnClose = () => {
    dispatch(setError(null));
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
        </ScrollView>
      </KeyboardAvoidingView>

      <Loader visible={!!loading} text={loading} />

      <ConnectionStatusModal
        isVisible={showErrorModal}
        onClose={handleOnClose}
        icon={Images.failBluetooth}
        title={"Failed to connect"}
        description={error}
        onRetry={handleOnClose}
      />
    </MainContainer>
  );
};

export default ConnectToWifiPasswordScreen;
