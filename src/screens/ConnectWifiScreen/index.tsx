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
import { bin2String } from "../../utils/ble.util";
import { useSelector } from "react-redux";
import { toast } from "../../utils/toast.utils";
import WifiManager from "react-native-wifi-reborn";
import { LogBox } from "react-native";
import { usePermission } from "../../hooks/usePermission";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function ConnectWifiScreen({ navigation }) {
  const [connectedWifi, setConnectedWifi] = useState(null);
  const { scannedWifis } = useSelector((state: any) => state.printer);
  const { AppTheme } = useTheme();
  const [deviceConnectedWifi, setDeviceConnectedWifi] = useState(null);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const { checkAndRequestPermission } = usePermission("wifi");

  const handleNext = () => {
    if (!connectedWifi) {
      return toast.fail("Fail", "Please select network!");
    } else {
      navigation.navigate(ScreenNames.ConnectToWifiPasswordScreen, {
        isSuccess: !!connectedWifi,
        wifi: connectedWifi,
      });
    }
  };

  useEffect(() => {
    const fetchSSID = async () => {
      const hasPermission = await checkAndRequestPermission();
      if (hasPermission) {
        try {
          const ssid = await WifiManager.getCurrentWifiSSID();
          setDeviceConnectedWifi(ssid);
        } catch (err) {
          console.warn("Failed to get SSID", err);
        }
      } else {
        console.warn("Permission denied");
        toast.fail(
          "To detect the connected Wi-Fi, this app needs access to your location. \n You can also enable location permission from Settings."
        );
      }
    };

    fetchSSID();
  }, [scannedWifis]);

  function getReadableBand(bandValue) {
    switch (bandValue) {
      case 1:
        return "2.4 GHz";
      case 2:
        return "5 GHz";
      default:
        return "Unknown";
    }
  }
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
            {scannedWifis?.length < 1 ? (
              <Text bold size={14} color={AppTheme.Black}>
                Scanning...
              </Text>
            ) : (
              <>
                {[...scannedWifis]
                  .sort((a, b) => {
                    const ssidA = bin2String(a.getWifi().getSsid());
                    const ssidB = bin2String(b.getWifi().getSsid());
                    if (
                      ssidA === deviceConnectedWifi &&
                      ssidB !== deviceConnectedWifi
                    )
                      return -1;
                    if (
                      ssidA !== deviceConnectedWifi &&
                      ssidB === deviceConnectedWifi
                    )
                      return 1;
                    return ssidA.localeCompare(ssidB);
                  })
                  .map((item, index) => {
                    const ssidCounts = scannedWifis.reduce((acc, item) => {
                      const ssid = bin2String(item.getWifi().getSsid());
                      acc[ssid] = (acc[ssid] || 0) + 1;
                      return acc;
                    }, {});
                    let ssid = bin2String(item.getWifi().getSsid());
                    const wifiInfo = item.getWifi();
                    const band = wifiInfo.getBand();
                    const readableBand = getReadableBand(band);
                    const displayName =
                      ssidCounts[ssid] > 1 ? `${ssid} (${readableBand})` : ssid;
                    return (
                      <ParingConnectionCard
                        isActive={selectedWifi == displayName}
                        isCurrent={deviceConnectedWifi == ssid}
                        heading={displayName}
                        subHeading={""}
                        onPress={() => {
                          setSelectedWifi(displayName);
                          setConnectedWifi(item);
                        }}
                        key={index}
                        icon={Images.wifiRound}
                      />
                    );
                  })}
              </>
            )}
          </ScrollView>
        </SectionContainer>
      </View>
      <PrimaryButton
        title="Next"
        customStyles={styles.nextBtn}
        onPress={handleNext}
      />
    </MainContainer>
  );
}
