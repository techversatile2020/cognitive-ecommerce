import { ScrollView, View, PermissionsAndroid } from "react-native";
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
import { useContext, useEffect, useState } from "react";
import { SD } from "../../utils";
import { knownDevices, newDevices } from "./extra/dummyData";
import { base64ToArrayBuffer, bin2String } from "../../utils/ble.util";
import { useSelector } from "react-redux";
import { wifiService } from "../../../services";
import { toast } from "../../utils/toast.utils";
import WifiManager from "react-native-wifi-reborn";

// import ver from './../../../protos'
const version_pb = require("./../../../protos/version_pb");
const request_pb = require("./../../../protos/request_pb");
const common_pb = require("./../../../protos/common_pb");
const response_pb = require("./../../../protos/response_pb");
const result_pb = require("./../../../protos/result_pb");

export default function ConnectWifiScreen({ navigation, route }) {
  const [connectedWifi, setConnectedWifi] = useState(null);
  const [showWifiError, setShowWifiError] = useState(false);
  const [showGenralError, setShowGenralError] = useState(false);
  const { scannedWifis } = useSelector((state: any) => state.printer);
  const { AppTheme } = useTheme();
  const [deviceConnectedWifi, setDeviceConnectedWifi] = useState(null);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const handleNext = () => {
    console.log(connectedWifi);

    if (!connectedWifi) return toast.fail("Fial", "Please select network!");
    navigation.navigate(ScreenNames.ConnectToWifiPasswordScreen, {
      isSuccess: !!connectedWifi,
      wifi: connectedWifi,
    });
  };

  useEffect(() => {
    const fetchCurrentWifi = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission is required for WiFi connections",
          message:
            "This app needs location permission as this is required  " +
            "to scan for wifi networks.",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const ssid = await WifiManager.getCurrentWifiSSID();
        setDeviceConnectedWifi(ssid);
      } else {
        // Permission denied
        // toast.fail('Fail','User denied wifi ')
      }
    };
    fetchCurrentWifi();
  }, [scannedWifis]);

  const handleConnectWifi = (e) => {
    if (e?.id == "3") {
      return setShowWifiError(true);
    } else if (e?.id == "4") {
      return setShowGenralError(true);
    }

    setConnectedWifi(e);
  };

  const handleOnClose = () => {
    setShowWifiError(false);
    setShowGenralError(false);
  };

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
            {/* <Text bold size={14} color={AppTheme.Black}>
              Known Devices
            </Text> */}
            {scannedWifis?.length < 1 ? (
              <Text bold size={14} color={AppTheme.Black}>
                Scanning...
              </Text>
            ) : (
              <>
                {scannedWifis.map((item, index) => {
                  const ssidCounts = scannedWifis.reduce((acc, item) => {
                    const ssid = bin2String(item.getWifi().getSsid());
                    acc[ssid] = (acc[ssid] || 0) + 1;
                    return acc;
                  }, {});
                  let ssid = bin2String(item.getWifi().getSsid());
                  const wifiInfo = item.getWifi();
                  const band = wifiInfo.getBand(); // e.g., 1 or 2
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
                        handleConnectWifi(item);
                      }}
                      key={index}
                      icon={Images.wifiRound}
                    />
                  );
                })}
              </>
            )}

            {/* <Text bold size={14} color={AppTheme.Black} topSpacing={10}>
              New Devices
            </Text> */}
            {/* {newDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  isActive={item.id === connectedWifi?.SSID}
                  heading={item.name}
                  subHeading={item.subheading}
                  onPress={() => handleConnectWifi(item)}
                  key={index}
                  icon={item.icon}
                />
              );
            })} */}
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
