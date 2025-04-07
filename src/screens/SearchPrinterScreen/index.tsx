import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import {
  ConnectionStatusModal,
  CustomImage,
  CustomModal,
  Loader,
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
import { dummyData } from "./extra/dummyData";
import { SD } from "../../utils";
import { BLEService } from "../../../services";
import Toast from "react-native-toast-message";

const SearchPrinterScreen = ({ navigation }) => {
  const ble = BLEService;

  const { AppTheme } = useTheme();
  const [printerSelected, setPrinterSelected] = useState(ble?.device || null);
  const [showPrinterErrorModal, setShowPrinterErrorModal] = useState(null);
  const [devices, setDevices] = useState<any>([]);
  const [loading, setLoading] = useState(null);
  const [sortedDevices, setSortedDevices] = useState([]);

  const fetchBleDevices = async () => {
    try {
      await ble.initializeBLE();
      ble.scanDevices(setDevices);

      // let isDeviceConnected = await ble.isDeviceConnected();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBleDevices();
    setLoading("Scanning devices...");
    setTimeout(() => {
      setLoading(null);
    }, 2000);

    return () => {
      ble.stopScan();
    };
  }, []);

  const handleNext = async () => {
    if (!printerSelected) {
      return Toast.show({
        text1: "Please connect printer first",
        type: "error",
      });
    }
    await ble.discoverAllServicesAndCharacteristicsForDevice();
    navigation.navigate(ScreenNames.ConnectWifiScreen);
  };

  const handlePrinterConnect = async (it) => {
    try {
      if (loading) return; // Prevent double-tap or rapid calls
      const connectedDevice = ble.device;
      // If device is already connected, disconnect it
      if (connectedDevice?.id === it?.id) {
        setLoading("Disconnecting from device...");
        let isConnected = await ble.isDeviceWithIdConnected(
          connectedDevice?.id
        );
        console.log("DISCONNECT ", isConnected);

        await ble.disconnectDevice();

        setPrinterSelected(null);
      } else {
        // First disconnect any existing connection before connecting to new device
        if (connectedDevice?.id) {
          await ble.disconnectDevice();
        }
        setLoading("Connecting...");
        await ble.connectToDevice(it?.id);
        setPrinterSelected(ble.device);
      }

      setLoading(null);
    } catch (error) {
      console.log("ERROR => ", error);
      setLoading(null);
      setShowPrinterErrorModal(error?.message || "Connection error");
    }
  };

  const handleOnClose = () => {
    setShowPrinterErrorModal(null);
  };

  useEffect(() => {
    const sorted = [...devices].sort((a, b) => {
      if (a.id === printerSelected?.id) return -1;
      if (b.id === printerSelected?.id) return 1;
      return 0;
    });
    setSortedDevices(sorted);
  }, [devices, printerSelected]);

  return (
    <MainContainer customeStyle={{ paddingTop: SD.hp(0) }}>
      <MainHeader
        back={true}
        title="Search Printer"
        // mainContainerStyle={{ paddingTop: SD.hp(0) }}
      />
      <CustomImage source={Images.printerOutline} style={styles.printerIcon} />
      <Text
        bold
        color={AppTheme.Black}
        size={18}
        centered
        topSpacing={15}
        bottomSpacing={15}
      >
        Select a printer from list {"\n"}below to connect
      </Text>
      <View style={styles.sectionView}>
        <Text regular size={10} color={AppTheme.fontGray}>
          Printer should be within 6 ft of the device.
        </Text>
        <SectionContainer containerStyles={styles.printerSectionContainer}>
          <Text bold size={14} color={AppTheme.Black}>
            Printers
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  circle
                  // isActive={item.id == printerSelected}
                  // heading={item.name}
                  // subHeading={item.subheading}
                  // onPress={() => handlePrinterConnect(item.id)}
                  // key={index}
                  // icon={item.icon}
                  isActive={item?.id == printerSelected?.id}
                  heading={item?.name || "Unamed device"}
                  subHeading={item?.id || ""}
                  onPress={() => handlePrinterConnect(item)}
                  key={index}
                  icon={Images.printerOutlineWithoutBg}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </View>
      {/* <PrinterConnectionErrorModal
        isVisible={showPrinterErrorModal}
        onClose={() => setShowPrinterErrorModal(false)}
      /> */}
      <ConnectionStatusModal
        isVisible={!!showPrinterErrorModal}
        onClose={handleOnClose}
        icon={Images.failBluetooth}
        title="Unable to Connect Bluetooth"
        description={showPrinterErrorModal}
        onCancel={handleOnClose}
        onRetry={handleOnClose}
      />
      <PrimaryButton
        title="Next"
        customStyles={styles.nextBtn}
        onPress={handleNext}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

// const PrinterConnectionErrorModal = ({ isVisible, onClose }) => {
//   const { AppTheme } = useTheme();
//   return (
//     <CustomModal isVisible={isVisible} onClose={onClose}>
//       <View
//         style={{ ...styles.modalContainer, backgroundColor: AppTheme.White }}
//       >
//         <CustomImage source={Images.failPrinter} style={styles.deviceIcon} />
//         <Text bold size={18} color={AppTheme.Black}>
//           Unable to Connect Printer
//         </Text>
//         <Text
//           regular
//           size={14}
//           color={AppTheme.fontGray}
//           centered
//           width={270}
//           topSpacing={20}
//           bottomSpacing={20}
//         >
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//           eiusmod tempor incididunt ut labore et dolore.
//         </Text>
//         <View style={styles.modalBtnsView}>
//           <PrimaryButton
//             title="Cancel"
//             customStyles={{
//               flex: 2,
//               marginHorizontal: SD.wp(5),
//               borderRadius: 15,
//             }}
//             onPress={onClose}
//           />
//           <PrimaryButton
//             title="Retry"
//             customStyles={{ flex: 2, borderRadius: 15 }}
//           />
//         </View>
//       </View>
//     </CustomModal>
//   );
// };
export default SearchPrinterScreen;
