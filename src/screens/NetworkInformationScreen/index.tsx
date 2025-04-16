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
import { useTheme } from "../../hooks";
import { useSelector } from "react-redux";
const NetworkInformationScreen = ({ route, navigation }) => {
  const { AppTheme } = useTheme();
  const { statusCategory, Status, IP_Address, RSSI, SSID } = useSelector(
    (state: any) => state.printer.printerDetailsByIp[route?.params?.IP_Address]
  );

  const handleConnectOtherWifi = () => {
    return navigation.navigate(ScreenNames.PrinterSetupScreen);
  };
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
            backgroundColor: AppTheme.lightGreen,
          }}
        >
          <Text bold size={16} color={AppTheme.White} centered>
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
