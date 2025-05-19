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

const PrinterSettingScreen = ({ navigation, route }) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [printer, setPrinter] = useState(route?.params?.data || {});
  const IP_Address = route?.params?.IP_Address;
  const [loading, setLoading] = useState(null);
  const { refetch, isFetching, isLoading } = usePrinter(IP_Address, ["Status"], false);
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
  } = useSelector((state: any) => state.printer.printerDetailsByIp[IP_Address]);

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
        // console.log(el.title);
        navigation.navigate(ScreenNames.HttpServerWebVIew, { IP_Address });
        break;
      case "start calibration":
        // handlePrinterSetting("calibrate");
        setShowCalibrationModal(true);
        break;
      case "print diagnostic label":
        // console.log(el.title);
        handlePrinterSetting("diagnostic");
        break;
      case "print test label":
        // console.log(el.title);
        handleTestPrint();
        break;
      case "factory reset":
        navigation.navigate(ScreenNames.FactoryResetScreen, { IP_Address });
        break;
      default:
        console.log(null);
        break;
    }
  };

  const handlePrinterSetting = async (path) => {
    try {
      setLoading("Setting values to printer...");
      let response = await sendRequest({
        ip: IP_Address,
        method: "POST",
        endpoint: `${path}.cgi`,
        data: "",
      });
      console.log("Success response => ", response);
      refetch();

      setLoading(null);
      toast.success(`${path} sucesss`);
    } catch (error) {
      setLoading(null);
      console.log("handlePRinterSettings", error);
      toast.fail(`Failed','Failed to ${path} printer`);
    }
  };

  const triggerCalibrationModal = () => {
    handlePrinterSetting("calibrate");
    setShowCalibrationModal(!showCalibrationModal);
  };

  useEffect(() => {
    const setCalibError = async () => {
      try {
        let errorCode = Status == "Calibrate Failed" ? 21 : 20;
        console.log({
          IP_Address,
          errorCode,
        });

        let response = await sendRequest({
          ip: IP_Address,
          method: "POST",
          endpoint: `errorcondition.cgi?error=${errorCode}`,
          data: `error=${errorCode}`,
          headers: {},
        });
        console.log("Error response => ", response);
      } catch (error) {
        console.log("error updating calibrate status ", error);
      }
    };
    if (Status == "Calibrate Succeeded" || Status == "Calibrate Failed") {
      // console.log("Calibriting success");
      // setCalibError();
    }
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
      // let res = await fetchPrinterDetails(IP_Address);
      // dispatch(setPrinterDetailsByIp({ ip: IP_Address, details: res }));
      refetch();
      setLoading(null);
      toast.success("Refreshed!!!");
    } catch (error) {
      console.log("error refresing...", error);
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
      console.log("values afer test => ", response);
      setLoading(null);
      toast.success("Test print command sent!");
    } catch (error) {
      setLoading(null);
      console.log("Setting value error => ", error);

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
        onClose={triggerCalibrationModal}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

const CalibrationModal = ({ isVisible, onClose }) => {
  const { AppTheme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<string | number>("2");

  const data = [
    { label: "Gap", value: "1" },
    { label: "Bar", value: "2" },
    { label: "Notch", value: "3" },
  ];
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
          <CustomDropdown
            data={data}
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
            onPress={onClose}
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
