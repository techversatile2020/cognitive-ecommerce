import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { Images } from "../../config";
import { useTheme } from "../../hooks";
import { useSelector } from "react-redux";
const indexValues = [
  {
    label: "None",
    value: "1",
  },
  {
    label: "BAR",
    value: "2",
  },
  {
    label: "Gap",
    value: "3",
  },
  {
    label: "Notch",
    value: "4",
  },
];

const printStValues = [
  { label: "2 Inches / Second", value: "2" },
  { label: "3 Inches / Second", value: "3" },
  { label: "5 Inches / Second", value: "5" },
  { label: "4 Inches / Second", value: "4" },
  { label: "6 Inches / Second", value: "6" },
  { label: "8 Inches / Second", value: "8" },
];
const PrinterInfoScreen = ({ route }) => {
  const { AppTheme } = useTheme();
  const {
    ModelNum,
    SerialNumber,
    FirmwareVersion,
    WiFiFwVersion,
    SpeedV,
    IndexV,
    HostName,
    statusCategory,
  } = useSelector(
    (state: any) => state.printer.printerDetailsByIp[route?.params?.IP_Address]
  );
  const indexSetting = indexValues?.find((val) => val.value == IndexV);
  const printSt = printStValues?.find((val) => val.value == SpeedV);
  const colorOnStatusChange =
    statusCategory == "OK"
      ? AppTheme.lightGreen
      : statusCategory == "WARNING"
      ? AppTheme.Yellow
      : AppTheme.Red;
  return (
    <MainContainer>
      <MainHeader
        mainContainerStyle={{
          paddingTop: 0,
        }}
        back
        title="Printer Info"
      />
      <View style={{ flex: 1, alignItems: "center" }}>
        <CustomImage source={Images.printer} style={styles.deviceImage} />
        <Text
          bold
          size={24}
          color={AppTheme.Black}
          topSpacing={20}
          style={{ textTransform: "uppercase" }}
        >
          {/* CTPG5824 */}
          {HostName}
        </Text>
        <Text regular size={14} color={AppTheme.fontGray} topSpacing={10}>
          Printer Cognitive
        </Text>
        <View
          style={{
            ...styles.connectedTextView,
            backgroundColor: colorOnStatusChange,
          }}
        >
          <Text bold size={10} color={AppTheme.White} centered>
            {/* Connected */}
            {statusCategory == "OK" ? "Connected" : "Disconnected"}
          </Text>
        </View>
        <SectionContainer containerStyles={styles.sectionContainerStyles}>
          <InforTextTable title="Model Name" value={ModelNum} />
          <InforTextTable title="Serial Number" value={SerialNumber} />
          <InforTextTable title="Firmware Version" value={FirmwareVersion} />
          <InforTextTable title="Wifi Firm Version" value={WiFiFwVersion} />
          <InforTextTable title="Index Setting" value={indexSetting.label} />
          <InforTextTable title="Print Statistics" value={printSt.label} />
        </SectionContainer>
      </View>

      <PrimaryButton title="Remove" customStyles={{ borderRadius: 15 }} />
    </MainContainer>
  );
};

const InforTextTable = ({ title, value }) => {
  const { AppTheme } = useTheme();
  return (
    <View
      style={{ ...styles.infoTextTableView, borderBottomColor: AppTheme.White }}
    >
      <Text regular size={12} color={AppTheme.Primary} left>
        {title}
      </Text>
      <Text regular size={12} color={AppTheme.Black} right>
        {value}
      </Text>
    </View>
  );
};
export default PrinterInfoScreen;
