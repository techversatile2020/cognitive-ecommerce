import { View } from "react-native";
import {
  CustomImage,
  InfoFieldComp,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { styles } from "./styles";
import { useAnalytics, usePrinter, useTheme } from "../../hooks";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const NetworkInformationScreen = ({ route, navigation }) => {
  const { AppTheme } = useTheme();
  const { statusCategory, Status, IP_Address, RSSI, SSID } = useSelector(
    (state: any) => state.printer.printerDetailsByIp[route?.params?.IP_Address]
  );
  usePrinter(IP_Address, ["Status", "RSSI", "SSID"]);
  const { track } = useAnalytics();
  const colorOnStatusChange =
    statusCategory == "OK"
      ? AppTheme.lightGreen
      : statusCategory == "WARNING"
      ? AppTheme.Yellow
      : statusCategory == "ERROR"
      ? AppTheme.Red
      : AppTheme.disableGray;
  let isDisconnected = statusCategory == "Disconnected";

  const handleConnectOtherWifi = () => {
    return navigation.navigate(ScreenNames.PrinterSetupScreen);
  };

  useEffect(() => {
    track("Printer Network Info Page ");
  }, []);
  return (
    <MainContainer>
      <MainHeader
        title="Network Information"
        back
        mainContainerStyle={{ paddingVertical: 0 }}
      />
      <View style={styles.container}>
        <SectionContainer containerStyles={styles.networkIconView}>
          <CustomImage source={Images.wifiRound} style={styles.networkIcon} />
        </SectionContainer>
        <View
          style={{
            ...styles.connectedTextView,
            backgroundColor: colorOnStatusChange,
          }}
        >
          <Text
            bold
            size={16}
            color={isDisconnected ? AppTheme.Black : AppTheme.White}
            centered
          >
            {/* Connected */}
            {statusCategory == "OK" ? "Connected" : "Disconnected"}
          </Text>
        </View>
        <View style={styles.infoFieldSection}>
          <InfoFieldComp title="Router Name" value={SSID} />
          <InfoFieldComp title="Signal Strength" value={RSSI} />
          <InfoFieldComp title="IP Address" value={IP_Address} />
        </View>
      </View>
      <PrimaryButton
        title="Connect to another Network"
        customStyles={{
          borderRadius: 15,
        }}
        onPress={handleConnectOtherWifi}
      />
    </MainContainer>
  );
};

export default NetworkInformationScreen;
