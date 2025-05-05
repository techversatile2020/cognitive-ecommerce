import { useEffect, useState } from "react";
import {
  CustomDropdown,
  CustomTextInput,
  IncreamentDecreamentComp,
  InfoFieldComp,
  Loader,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { styles } from "./styles";
import { usePrinter, useTheme } from "../../../../hooks";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { sendRequest } from "../../../../services/printerServices";
import { toast } from "../../../../utils/toast.utils";
import { generateTestLabelScript } from "../../../../utils/printer.utls";
const MediaSettingLabelComp = ({ data }: any) => {
  const { ip } = data;
  const { ModelNum, PrintWidth, ShiftLeft, IndexV, LanguageV, MediaTypeV } =
    useSelector((state: any) => state.printer.printerDetailsByIp[ip]);
  usePrinter(ip, [
    "ModelNum",
    "PrintWidth",
    "ShiftLeft",
    "IndexV",
    "LanguageV",
    "MediaTypeV",
  ]);
  const [selectedSpeed, setSelectedSpeed] = useState<string | number>(
    IndexV || "1"
  );
  const [loading, setLoading] = useState(null);
  const { refetch } = usePrinter(ip);

  const [typeData, setTypeData] = useState([
    {
      label: "Direct thermal",
      value: "0",
    },
    {
      label: "Thermal Transfer",
      value: "1",
    },
  ]);

  const [speedData, setSpeedData] = useState([
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
  ]);
  const { AppTheme } = useTheme();
  const [modelNumber, setModelNumber] = useState(null);
  const [printWidth, setPrintWidth] = useState<any>(Number(PrintWidth || 0));
  const [shiftLeft, setShiftLeft] = useState<any>(Number(ShiftLeft || 0));
  const [printWidthError, setPrintWidthError] = useState<string | null>(null);
  const [shiftLeftError, setShiftLeftError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | number>(MediaTypeV);

  const getPrintWidthRange = () => {
    if (
      ModelNum &&
      (ModelNum.startsWith("CXT4") ||
        ModelNum.startsWith("CXD4") ||
        ModelNum.startsWith("DBD4") ||
        ModelNum.startsWith("DBT4"))
    ) {
      return { min: 1, max: 409 }; // 4-inch print head
    } else if (
      ModelNum &&
      (ModelNum.startsWith("CXT2") ||
        ModelNum.startsWith("CXD2") ||
        ModelNum.startsWith("DBD2") ||
        ModelNum.startsWith("DBT2"))
    ) {
      return { min: 1, max: 203 }; // 2-inch print head
    }
    return { min: 0, max: 0 }; // default range if model number is not recognized
  };

  const getShiftLeftRange = () => {
    if (
      ModelNum &&
      (ModelNum.startsWith("CXT4") ||
        ModelNum.startsWith("CXD4") ||
        ModelNum.startsWith("DBD4") ||
        ModelNum.startsWith("DBT4"))
    ) {
      return { min: -409, max: 409 }; // 4-inch print head
    } else if (
      ModelNum &&
      (ModelNum.startsWith("CXT2") ||
        ModelNum.startsWith("CXD2") ||
        ModelNum.startsWith("DBD2") ||
        ModelNum.startsWith("DBT2"))
    ) {
      return { min: -203, max: 203 }; // 2-inch print head
    }
    return { min: 0, max: 0 }; // default range if model number is not recognized
  };

  useEffect(() => {
    if (ModelNum) {
      // Validate print width when model number changes
      const { min, max } = getPrintWidthRange();
      if (printWidth < min || printWidth > max) {
        setPrintWidthError(
          `Print width value must be between ${min} and ${max}`
        );
      } else {
        setPrintWidthError(null);
      }

      // Validate shift left when model number changes
      const { min: shiftMin, max: shiftMax } = getShiftLeftRange();
      if (shiftLeft < shiftMin || shiftLeft > shiftMax) {
        setShiftLeftError(
          `Shoft left value must be between ${shiftMin} and ${shiftMax}`
        );
      } else {
        setShiftLeftError(null);
      }
    }
  }, [ModelNum, printWidth, shiftLeft, selectedSpeed]);

  const handleSetValues = async () => {
    if (shiftLeftError !== null || printWidthError !== null) return;
    try {
      setLoading(`Setting values to printer...`);
      await sendRequest({
        ip,
        endpoint: "saveprintervarvalues.cgi",
        data: `ShiftLeft=${shiftLeft}&IndexV=${selectedSpeed}&PrintWidth=${printWidth}`,
        method: "POST",
      });
      refetch();

      setLoading(null);
    } catch (error) {
      setLoading(null);
      console.log("Setting value error => ", error);

      toast.fail("Failed", "Update failed. Check printer connections!!!");
    }
  };

  const handleStartCalibration = async () => {
    try {
      let response = await sendRequest({
        ip,
        method: "POST",
        endpoint: "calibrate.cgi",
        data: "",
      });
      console.log("Calibrate response => ", response);
      refetch();
      setLoading(null);
    } catch (error) {
      console.log("Error calibriting => ", error);
      setLoading(null);
      toast.fail("Fail", "Calibrating failed.");
    }
  };

  const handleTestPrint = async () => {
    try {
      setLoading("Sending test command...");

      let script = generateTestLabelScript(LanguageV, {
        shiftLeft: shiftLeft,
        printWidth: printWidth,
      });

      let response = await sendRequest({
        ip,
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
    <MainContainer
      customeStyle={{
        marginTop: SD.hp(20),
        paddingHorizontal: 0,
        paddingVertical: 0,
        padding: 0,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginBottom: SD.hp(10) }}>
          <InfoFieldComp
            title="Indexing"
            children={
              <CustomDropdown
                iconColor={AppTheme.Primary}
                data={speedData}
                onChange={setSelectedSpeed}
                value={selectedSpeed}
                dropdownStyle={styles.dropdownStyles}
                itemStyle={{
                  ...styles.customItemStyle,
                  backgroundColor: AppTheme.White,
                }}
                containerStyle={{
                  ...styles.itemContainerStyle,
                  backgroundColor: AppTheme.White,
                }}
              />
            }
          />
          {/* <InfoFieldComp
            title="Model Number"
            children={
              <CustomTextInput
                placeholder="Enter model number"
                value={ModelNum}
                setValue={(e) => setModelNumber(e)}
                backgroundColor={AppTheme.White}
                placeholderTextColor={AppTheme.fontGray}
                bold
                fontSize={12}
                textColor={AppTheme.fontGray}
                topSpacing={10}
                radius={10}
                height={50}
                disable
                // style={{ padding: SD.wp(15) }}
              />
            }
          /> */}
          <InfoFieldComp
            title="Type"
            children={
              <CustomDropdown
                iconColor={AppTheme.Primary}
                data={typeData}
                onChange={setSelectedType}
                value={selectedType}
                dropdownStyle={styles.dropdownStyles}
                itemStyle={{
                  ...styles.customItemStyle,
                  backgroundColor: AppTheme.White,
                }}
                containerStyle={{
                  ...styles.itemContainerStyle,
                  backgroundColor: AppTheme.White,
                }}
              />
            }
          />
          <InfoFieldComp
            title="Print Width (Inches)"
            children={
              <IncreamentDecreamentComp
                value={printWidth}
                setValue={(e) => setPrintWidth(e)}
                sign="in"
              />
            }
          />
          {printWidthError && (
            <Text size={16} color={AppTheme.Red}>
              {printWidthError}
            </Text>
          )}
          <InfoFieldComp
            title="Shift Left (Hundredths of an inch)"
            children={
              <IncreamentDecreamentComp
                value={shiftLeft}
                setValue={(e) => setShiftLeft(e)}
                sign="in"
              />
            }
          />
          {shiftLeftError && (
            <Text size={16} color={AppTheme.Red}>
              {shiftLeftError}
            </Text>
          )}
        </View>
        <PrimaryButton
          title="Start Calibration"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
          onPress={handleStartCalibration}
        />
        <PrimaryButton
          title="Apply"
          customStyles={{ borderRadius: 15 }}
          onPress={handleSetValues}
        />
        <PrimaryButton
          title="Test Print"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
          onPress={handleTestPrint}
        />
      </ScrollView>
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};
export default MediaSettingLabelComp;
