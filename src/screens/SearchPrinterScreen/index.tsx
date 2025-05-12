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
import { usePrinter, useTheme } from "../../hooks";
import { useEffect, useRef, useState } from "react";
import { ConnectButtonHandler, SD } from "../../utils";
import { BLEService } from "../../../services";
import Toast from "react-native-toast-message";

import { useDispatch, useSelector } from "react-redux";
import {
  addConnectedPrinter,
  addScannedWifi,
  setCurrentConnectedPrinter,
  setScannedWifis,
} from "../../redux/reducers";
import { toast } from "../../utils/toast.utils";
import { base64ToArrayBuffer, bin2String } from "../../utils/ble.util";
import navigationService from "../../config/navigationService";
import { fetchPrinterDetails } from "../../services/printerServices";
import { setPrinterDetailsByIp } from "../../redux/reducers";
import { fetchPrinterVars } from "../../api";
import { useNavigation } from "@react-navigation/native";

const version_pb = require("./../../../protos/version_pb");
const request_pb = require("./../../../protos/request_pb");
const common_pb = require("./../../../protos/common_pb");
const response_pb = require("./../../../protos/response_pb");
const result_pb = require("./../../../protos/result_pb");

const SearchPrinterScreen = ({ navigation }) => {
  const ble = BLEService;
  const { AppTheme } = useTheme();
  const [printerSelected, setPrinterSelected] = useState(ble?.device || null);
  const [showPrinterErrorModal, setShowPrinterErrorModal] = useState(null);
  const [loading, setLoading] = useState(null);
  const [bleScannedDevices, setBleScannedDevices] = useState([]);
  const { scannedWifis, currentConnectedPrinter } = useSelector(
    (state: any) => state.printer
  );

  const [connectionError, setConnectionError] = useState(null);
  const hasUserClicked = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    ScanButtonHandler();
    return () => {
      ble.stopScan();
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(async () => {
      if (!hasUserClicked.current && bleScannedDevices?.length === 1) {
        await handleApply(bleScannedDevices[0], true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [bleScannedDevices]);

  const ScanButtonHandler = async () => {
    try {
      dispatch(setCurrentConnectedPrinter(null));
      setLoading("Scanning...");

      await ble.scanDevices(setBleScannedDevices, [
        "14387800-130c-49e7-b877-2881c89cb258",
      ]);
      setLoading(null);
    } catch (error) {
      setLoading(null);
      console.log("EERRR", error);
    }
  };

  const handleNext = async () => {
    if (!currentConnectedPrinter) {
      return Toast.show({
        text1: "Please select a printer before proceeding.",
        type: "error",
      });
    }
    navigation.navigate(ScreenNames.ConnectWifiScreen);
  };

  const handleOnClose = () => {
    setShowPrinterErrorModal(null);
  };

  const handleApply = async (device, goNext = false) => {
    if (!goNext) {
      hasUserClicked.current = true;
    }
    try {
      let response = await ConnectButtonHandler({
        device,
        setLoading,
        scannedWifis,
        dispatch,
        listener1,
        listener2,
        goNext,
        navigation,
      });

      if (response?.status == "fail") {
        setShowPrinterErrorModal("Unable to Connect to Device");
        setConnectionError(`${response?.error} \n Your device lost connection`);
        return;
      }
    } catch (error) {
      console.log("HandleApply Error => ", error);
      showPrinterErrorModal("Unable to Connect to Device");
      setConnectionError(
        error?.message || "Unexpected error\n please try again"
      );
    }
  };
  function listener1(error, characteristic) {
    console.log("ERROR, CHARACTERISTICS => ", {
      error,
      characteristic,
    });

    if (error) {
      setLoading(false);
      // dispatch(setCurrentConnectedPrinter(null));
      return toast.fail("Disconnected", error?.message);
    }
    try {
      if (characteristic.value) {
        const response = response_pb.Response.deserializeBinary(
          base64ToArrayBuffer(characteristic.value)
        );
        if (response.hasDeviceStatus()) {
          const deviceStatus = response.getDeviceStatus();
          const connectionInfo = deviceStatus.getConnectionInfo();

          const ipBytes = connectionInfo?.getIp4Addr?.(); // optional chaining in case undefined
          const ipAddr = `${ipBytes[0]}.${ipBytes[1]}.${ipBytes[2]}.${ipBytes[3]}`;

          fetchPrinterDetails(ipAddr)
            .then((details: any) => {
              console.log("Got Details", details);
              toast.success(
                `Printer ${details?.HostName?.toUpperCase()} connected successfully`
              );

              dispatch(setPrinterDetailsByIp({ ip: ipAddr, details }));
              navigation.navigate(ScreenNames.PrinterSetupScreen, {
                isSuccess: true,
              });
            })
            .catch((err) =>
              toast.fail(
                "Unable to connect",
                err?.message || "Something went wrong!"
              )
            );

          // usePrinter({ ip: ipAddr });

          setLoading(null);

          // }
        }
      }
    } catch (err) {
      setShowPrinterErrorModal("Unable to connect to network");
      setConnectionError(
        "Device can not connect to network, Please check your password"
      );
      const isSafeToIgnore =
        err?.message?.includes("Invalid record in scannedWifis") ||
        err?.toString()?.includes("non-serializable");

      if (!isSafeToIgnore) {
        console.log("Unexpected error in Wifi handler:", err);
        // Optionally show toast or handle error
      }
    }
  }

  function listener2(error, characteristic) {
    if (error) {
      setLoading(false);
      navigation.navigate(ScreenNames.PrinterSetupScreen);
      return console.log("Listner 2 => ", error);
    }
    console.log("Recieved char => ", characteristic.value);
    try {
      const resultVal = base64ToArrayBuffer(characteristic.value);
      const result = result_pb.Result.deserializeBinary(resultVal);
      if (result.hasScanRecord()) {
        const scanRecord = result.getScanRecord();
        const ssid = bin2String(scanRecord.getWifi().getSsid());
        if (ssid) {
          const alreadyExists =
            Array.isArray(scannedWifis) &&
            scannedWifis.some((record) => {
              try {
                return bin2String(record?.getWifi?.().getSsid?.()) === ssid;
              } catch (err) {
                console.warn("Invalid record in scannedWifis:", record);
                return false;
              }
            });

          const updatedWifi = alreadyExists
            ? scannedWifis
            : [...(scannedWifis || []), scanRecord];

          // handleWifiScanner(updatedWifi);
          dispatch(addScannedWifi(scanRecord));
        }
      }
    } catch (error) {
      console.log("Unable to get wifi list: ", error);
    }
  }

  // useEffect(() => {
  //   try {
  //     BLEService.getConnectedDevices(currentConnectedPrinter?.serviceUUIDs);
  //   } catch (error) {
  //     dispatch(setCurrentConnectedPrinter(null));
  //   }
  // }, []);

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
            {bleScannedDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  circle
                  isActive={item?.id == currentConnectedPrinter?.id}
                  heading={item?.name || "Unamed device"}
                  subHeading={item?.id || ""}
                  onPress={() => handleApply(item)}
                  key={index}
                  icon={Images.printerOutlineWithoutBg}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </View>
      <ConnectionStatusModal
        isVisible={!!showPrinterErrorModal}
        onClose={handleOnClose}
        icon={Images.failBluetooth}
        title={showPrinterErrorModal}
        description={connectionError}
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
export default SearchPrinterScreen;
