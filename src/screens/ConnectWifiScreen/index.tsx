import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import {
  ConnectionStatusModal,
  CustomImage,
  MainContainer,
  MainHeader,
  ParingConnectionCard,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { useEffect, useState } from "react";
import { SD } from "../../utils";
import { knownDevices, newDevices } from "./extra/dummyData";
import { wifiService } from "../../../services";
import WifiManager from "react-native-wifi-reborn";

export default function ConnectWifiScreen({ navigation, route }) {
  const [connectedWifi, setConnectedWifi] = useState(null);
  const [showWifiError, setShowWifiError] = useState(false);
  const [showGenralError, setShowGenralError] = useState(false);
  const { AppTheme } = useTheme();
  const [wifiList, setWifiList] = useState([]);

  const handleNext = () => {
    // navigation.navigate(ScreenNames.PrinterConnectedSuccessScreen, {
    //   isSuccess: !!connectedWifi,
    // });
    navigation.navigate(ScreenNames.ConnectToWifiPasswordScreen, {
      isSuccess: !!connectedWifi,
      wifi: connectedWifi,
    });
  };

  useEffect(() => {
    console.log(route?.params);
  }, [route]);

  useEffect(() => {
    const fetchNetworks = async () => {
      await wifiService.scanWiFiNetworks((res) => {
        setWifiList(res);
        setConnectedWifi(res[0]?.SSID);
      });
    };

    fetchNetworks();
  }, []);

  const handleConnectWifi = (e) => {
    if (e.id == "3") {
      setShowWifiError(true);
    } else if (e.id == "4") {
      setShowGenralError(true);
    }
    // navigation.navigate(ScreenNames.ConnectToWifiPasswordScreen, {
    //   router: e,
    // });
  };

  const handleOnClose = () => {
    setShowWifiError(false);
    setShowGenralError(false);
  };

  return (
    <MainContainer customeStyle={{ paddingTop: SD.hp(0) }}>
      <MainHeader back={true} title="Connect to Wifi" />
      <CustomImage source={Images.printerOutline} style={styles.wifiIcon} />
      <Text
        bold
        color={AppTheme.Black}
        size={18}
        centered
        topSpacing={15}
        bottomSpacing={15}
      >
        Select the WiFi network your {"\n"}printer will connect
      </Text>
      <View style={{ flex: 1 }}>
        <SectionContainer containerStyles={styles.wifiSectionContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text bold size={14} color={AppTheme.Black}>
              Known Devices
            </Text>
            {wifiList.map((item, index) => {
              return (
                <ParingConnectionCard
                  isActive={item.SSID == connectedWifi}
                  heading={item.SSID}
                  subHeading={""}
                  onPress={() => setConnectedWifi(item.SSID)}
                  key={index}
                  icon={Images.wifiRound}
                />
              );
            })}
            <Text bold size={14} color={AppTheme.Black} topSpacing={10}>
              New Devices
            </Text>
            {newDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  isActive={item.id == connectedWifi}
                  heading={item.name}
                  subHeading={item.subheading}
                  onPress={() => handleConnectWifi(item)}
                  key={index}
                  icon={item.icon}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </View>
      <ConnectionStatusModal
        icon={Images.failWifi}
        title={"Unable to Connect Wifi"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore."
        }
        onCancel={handleOnClose}
        onRetry={handleOnClose}
        onClose={handleOnClose}
        isVisible={showWifiError}
      />
      <ConnectionStatusModal
        icon={Images.genralError}
        title={"General Error"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore."
        }
        onCancel={handleOnClose}
        onRetry={handleOnClose}
        onClose={handleOnClose}
        isVisible={showGenralError}
      />
      <PrimaryButton
        title="Next"
        customStyles={styles.nextBtn}
        onPress={handleNext}
      />
    </MainContainer>
  );
}
