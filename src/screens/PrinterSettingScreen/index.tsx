import { Platform, Pressable, View } from "react-native";
import {
  CustomDropdown,
  CustomImage,
  CustomModal,
  CustomTouchable,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { usePrinter, useTheme } from "../../hooks";
import { styles } from "./styles";
import { SD } from "../../utils";
import { PrinterSettingScreenCard } from "./components";
import { cardsDummyData } from "./extra";
import { useEffect, useState } from "react";
import { Fonts } from "../../styles";
import { useSelector } from "react-redux";
import { sendRequest } from "../../services/printerServices";
import { toast } from "../../utils/toast.utils";
import { generateTestLabelScript } from "../../utils/printer.utls";
import { store } from "../../redux";

const calibrationMethods = [
  { label: "Gap", value: "gap" },
  { label: "Bar", value: "bar" },
  { label: "Notch", value: "notch" },
];

const PrinterSettingScreen = ({ navigation, route }) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [printer, setPrinter] = useState(route?.params?.data || {});
  const IP_Address = route?.params?.IP_Address;
  const [loading, setLoading] = useState(null);
  const printerDetails = useSelector((state: any) => state.printer.printerDetailsByIp[IP_Address]);

  // in case it accidentally navigate here right after printer card removed. go back to home screne.
  if (!Object.keys(printerDetails).length) {
    return navigation.goBack();
  }

  const { refetch, isFetching, isLoading } = usePrinter(
    IP_Address,
    ["Status"],
    false
  );
  const {
    HostName,
    Status,
    statusCategory,
    LanguageV,
    SpeedV,
    TOFAdj,
    Darkness,
    PrintWidth,
    ShiftLeft,
  } = printerDetails;

  const { AppTheme } = useTheme();
  const handleClick = (el) => {
    switch (el.title.toLowerCase()) {
      case "network information":
        navigation.navigate(ScreenNames.NetworkInformationScreen, {
          IP_Address,
        });
        break;
      case "printer setting":
        navigation.navigate(ScreenNames.PrinterSettingNested, { IP_Address });
        break;
      case "media setting":
        navigation.navigate(ScreenNames.MediaSettingScreen, { IP_Address });
        break;
      case "advance setting":
        navigation.navigate(ScreenNames.AdvanceSettingScreen, { IP_Address });
        break;
      case "open http server":
        navigation.navigate(ScreenNames.HttpServerWebVIew, { IP_Address });
        break;
      case "start calibration":
        // handlePrinterSetting("calibrate");
        setShowCalibrationModal(true);
        break;
      case "print diagnostic label":
        // console.log(el.title);
        handlePrinterSetting("scripttransfer", undefined, "!PRINT TESTLABEL\r\n");
        break;
      case "print test label":
        handleTestPrint();
        break;
      case "factory reset":
        navigation.navigate(ScreenNames.FactoryResetScreen, { IP_Address });
        break;
      default:
        break;
    }
  };

  const handlePrinterSetting = async (path, parameter=undefined, data=undefined) => {
    try {
      setLoading("Setting values to printer...");
      await sendRequest({
        ip: IP_Address,
        method: "POST",
        endpoint: parameter ? `${path}.cgi?${parameter}` : `${path}.cgi`,
        data: data ? `${data}` : ``,
      });

      refetch();
      setLoading(null);
      toast.success(`${path} sucesss`);
    } catch (error) {
      setLoading(null);
      toast.fail(`Failed','Failed to ${path} printer`);
    }
  };

  const handleCalibrate = async (indexMode) => {
    handlePrinterSetting("calibrate", `type=${indexMode}`);
    setShowCalibrationModal(false);
  };

  const triggerCalibrationModal = (indexMode) => {
    handlePrinterSetting("calibrate", `type=${indexMode}`);
    setShowCalibrationModal(!showCalibrationModal);
  };

  useEffect(() => {
    if (Status === "Calibrating") {
      console.log("Calibrating", Status);

      let intervalId = null;
      setLoading(`${Status}...`);

      intervalId = setInterval(async () => {
        await refetch();

        // Get the latest status from Redux manually
        const latestStatus =
          store.getState().printer.printerDetailsByIp[IP_Address]?.Status;
        console.log("STATUS => ", latestStatus);

        if (
          latestStatus === "Calibrate Succeeded" ||
          latestStatus === "Calibrate Failed"
        ) {
          clearInterval(intervalId);
          toast.success(`Calibration result: ${latestStatus}`);
          setShowCalibrationModal(false);
          setLoading(null);
        }
      }, 2000);
    }
  }, [Status]);

  const closeCalibrationModal = () => {
    setShowCalibrationModal(!showCalibrationModal);
  }

  useEffect(() => {
    const setCalibError = async () => {
      try {
        let errorCode = Status == "Calibrate Failed" ? 21 : 20;
        let response = await sendRequest({
          ip: IP_Address,
          method: "POST",
          endpoint: `errorcondition.cgi?error=${errorCode}`,
          data: `error=${errorCode}`,
          headers: {},
        });
      } catch (error) {}
    };
  }, [Status]);

  const statusFontColor =
    statusCategory == "OK"
      ? AppTheme.lightGreen
      : statusCategory == "WARNING"
      ? AppTheme.YellowishTextColor
      : AppTheme.ErrorTextColor;

  const handleRefresh = async () => {
    try {
      setLoading("Refreshing...");
      refetch();
      setLoading(null);
      toast.success("Refreshed!");
    } catch (error) {
      toast.fail("Fail", "Fail to refresh");
    }
  };

  const handleTestPrint = async () => {
    try {
      setLoading("Sending test command...");

      let script = generateTestLabelScript(LanguageV, {
        speedValue: SpeedV,
        darkness: Darkness,
        shiftLeft: ShiftLeft,
        printWidth: PrintWidth,
        topOfForm: TOFAdj,
      });

      let response = await sendRequest({
        ip: IP_Address,
        endpoint: "scripttransfer.cgi",
        method: "POST",
        data: script,
        headers: { "Content-Type": "text/plain" },
      });
      setLoading(null);
      toast.success("Test print command sent!");
    } catch (error) {
      setLoading(null);

      toast.fail("Failed", "Test failed.");
    }
  };

  return (
    // <MainContainer customeStyle={{ paddingTop: 0 }}>
    <MainContainer>
      <MainHeader
        title="Printer Setting"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <SectionContainer
        containerStyles={{ marginTop: SD.hp(100), paddingBottom: SD.hp(10) }}
      >
        <Pressable
          style={{ marginVertical: SD.hp(15) }}
          onPress={() =>
            navigation.navigate(ScreenNames.PrinterInfoScreen, { IP_Address })
          }
        >
          <CustomImage source={Images.printer2} style={styles.deviceImage} />
          <Text
            bold
            size={24}
            centered
            color={AppTheme.Black}
            style={{ textTransform: "uppercase" }}
          >
            {/* CTPG5824 */}
            {HostName}
          </Text>
          <Text
            regular
            size={14}
            color={AppTheme.fontGray}
            centered
            style={{ paddingBottom: 5 }}
          >
            Printer Cognitive
          </Text>
        </Pressable>
        <View style={styles.btnsView}>
          <CustomTouchable
            style={[styles.sectionBtn, { backgroundColor: AppTheme.White }]}
          >
            <Text bold size={12}>
              Status
            </Text>
            <Text regular size={12} color={statusFontColor}>
              {/* Online */}
              {Status}
            </Text>
          </CustomTouchable>
          <CustomTouchable
            style={[
              styles.sectionBtn,
              {
                backgroundColor: AppTheme.White,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
            onPress={handleRefresh}
          >
            <CustomImage source={Images.refresh} style={styles.refreshIcon} />
            <Text bold size={17} color={AppTheme.Primary}>
              Refresh
            </Text>
          </CustomTouchable>
        </View>
      </SectionContainer>
      <View style={styles.cardsSection}>
        {cardsDummyData.map((item, index) => (
          <PrinterSettingScreenCard
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={() => handleClick(item)}
          />
        ))}
      </View>
      <CalibrationModal
        isVisible={showCalibrationModal}
        onTrigger={triggerCalibrationModal}
        onClose={closeCalibrationModal}
        onCalibrate={handleCalibrate}
        status={Status}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

const CalibrationModal = ({ isVisible, onClose, onTrigger, onCalibrate, status }) => {
  const { AppTheme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<string>("gap");

  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={[styles.clibModalContainer, { backgroundColor: AppTheme.White }]}
      >
        <View style={styles.clibModalContentContainer}>
          <Text bold size={24} primartColor centered>
            Start Calibration
          </Text>
          <Text
            regular
            size={12}
            color={AppTheme.fontGray}
            bottomSpacing={20}
            topSpacing={10}
          >
            Select Your Media Type
          </Text>

          {status != "Ready" && status === "Calibrate Succeeded" ? (
            <Text
              regular
              size={12}
              color={AppTheme.lightGreen}
              bottomSpacing={5}
              centered
            >
              ✅ Calibration completed successfully
            </Text>
          ) : status == "Calibrate Failed" ? (
            <Text
              regular
              size={12}
              color={AppTheme.ErrorTextColor}
              bottomSpacing={5}
              centered
            >
              ❌ Calibration failed. Please check the printer and try again
            </Text>
          ) : (
            <Text
              regular
              size={12}
              color={AppTheme.ErrorTextColor}
              bottomSpacing={5}
            >
              ⚠️ Printer is not ready. Please clear any errors before starting
              calibration
            </Text>
          )}

          <CustomDropdown
            disable={status != "Ready"}
            data={calibrationMethods}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Pick a color"
            dropdownStyle={{
              ...styles.customDropdownStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            iconColor={AppTheme.Primary}
            placeholderStyle={{
              ...styles.dropdownPlaceHoldertextStyles,
              color: AppTheme.fontGray,
            }}
            itemStyle={{
              ...styles.customItemStyle,
            }}
            containerStyle={{
              ...styles.itemContainerStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            place
            activeColor={AppTheme.White}
            // fontFamily={Fonts["Bold"]}
          />
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: SD.wp(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PrimaryButton
            title="Calibrate"
            customStyles={styles.modalBtn}
            onPress={() => onCalibrate(selectedValue)}
            disabled={status != "Ready"}
          />
          <CustomTouchable
            onPress={onClose}
            style={{ marginVertical: SD.hp(12) }}
          >
            <Text bold size={12} color={AppTheme.fontGray}>
              Skip
            </Text>
          </CustomTouchable>
        </View>
      </View>
    </CustomModal>
  );
};

export default PrinterSettingScreen;
