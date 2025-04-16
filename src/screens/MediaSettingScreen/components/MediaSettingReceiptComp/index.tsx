import { ScrollView, View } from "react-native";
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendRequest } from "../../../../services/printerServices";
import { toast } from "../../../../utils/toast.utils";
import { generateTestLabelScript } from "../../../../utils/printer.utls";
const MediaSettingReceiptComp = ({ data }) => {
  const [selectedType, setSelectedType] = useState<string | number>("1");
  const { ip } = data;
  const { ModelNum, PrintWidth, ShiftLeft, IndexV, LanguageV } = useSelector(
    (state: any) => state.printer.printerDetailsByIp[ip]
  );
  const { refetch } = usePrinter(ip);
  const [typeData, setTypeData] = useState([
    {
      label: "Direct thermal",
      value: "1",
    },
    {
      label: "Thermal Transfer",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();
  const [printWidth, setPrintWidth] = useState<any>(null);
  const [shiftLeft, setShiftLeft] = useState<any>(0);
  const [printWidthError, setPrintWidthError] = useState<string | null>(null);
  const [shiftLeftError, setShiftLeftError] = useState<string | null>(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    setPrintWidth(PrintWidth);
    setShiftLeft(Number(ShiftLeft));
  }, []);

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
  }, [ModelNum, printWidth, shiftLeft]);

  const handleSetValues = async () => {
    if (shiftLeftError != null || printWidthError !== null) return;
    try {
      setLoading(`Setting values to printer...`);
      await sendRequest({
        ip,
        endpoint: "saveprintervarvalues.cgi",
        data: `ShiftLeft=${shiftLeft}&MediaTypeV=${selectedType}&PrintWidth=${printWidth}`,
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
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        <View style={{ flex: 1 }}>
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
            title="Print Width (Hundredths of an Inch)"
            children={
              <CustomTextInput
                placeholder="Enter width"
                value={printWidth}
                setValue={(e) => setPrintWidth(e)}
                backgroundColor={AppTheme.White}
                placeholderTextColor={AppTheme.fontGray}
                bold
                fontSize={12}
                textColor={AppTheme.fontGray}
                topSpacing={10}
                radius={10}
                height={50}
                // style={{ padding: SD.wp(15) }}
              />
            }
          />
          {printWidthError && (
            <Text size={16} color={AppTheme.Red}>
              {printWidthError}
            </Text>
          )}
          <InfoFieldComp
            title="Shift Left (Hundredths of an Inch)"
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
export default MediaSettingReceiptComp;
