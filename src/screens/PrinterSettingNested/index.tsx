import { useEffect, useState } from "react";
import {
  CustomDropdown,
  InfoFieldComp,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { useAnalytics, usePrinter, useTheme } from "../../hooks";
import { View } from "react-native";
import { SD } from "../../utils";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import { sendRequest } from "../../services/printerServices";
import { toast } from "../../utils/toast.utils";
import { generateTestLabelScript } from "../../utils/printer.utls";

const PrinterSettingNested = ({ route }) => {
  const [selectedSpeed, setSelectedSpeed] = useState<string | number>("1");
  const [speedData, setSpeedData] = useState([]);
  const { ModelNum, Darkness, SpeedV, IP_Address, statusCategory, LanguageV } =
    useSelector(
      (state: any) =>
        state.printer.printerDetailsByIp[route?.params?.IP_Address]
    );
  usePrinter(IP_Address, [
    "Status",
    "ModelNum",
    "Darkness",
    "SpeedV",
    "LanguageV",
  ]);
  const { track } = useAnalytics();
  const { refetch } = usePrinter(IP_Address);
  const [sliderValue, setSliderValue] = useState(Number(Darkness) || 20);
  const { AppTheme } = useTheme();
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    if (ModelNum.startsWith("DB")) {
      setSpeedData([
        { label: "2 Inches / Second", value: "1" },
        { label: "3 Inches / Second", value: "2" },
        { label: "5 Inches / Second", value: "3" },
      ]);
    } else {
      setSpeedData([
        { label: "4 Inches / Second", value: "1" },
        { label: "6 Inches / Second", value: "2" },
        { label: "8 Inches / Second", value: "3" },
      ]);
    }
    setSelectedSpeed(SpeedV);
    setSliderValue(Number(Darkness));
  }, [ModelNum, Darkness]);

  useEffect(() => {
    track("Printer Nested Setting Page");
  }, []);

  const handleSetValues = async () => {
    if (statusCategory !== "OK") {
      return toast.fail("Failed", "Printer is not ready!");
    }
    try {
      setLoading(`Updating settings...`);
      let response = await sendRequest({
        ip: IP_Address,
        endpoint: "saveprintervarvalues.cgi",
        method: "POST",
        data: `Darkness=${sliderValue}&SpeedV=${selectedSpeed}`,
      });
      refetch();
      setLoading(null);
      toast.success("Success setting updated!");
    } catch (err) {
      setLoading(null);
      toast.fail("Failed", "Update failed.");
    }
  };
  const handleTestValues = async () => {
    // let response await sendRequest()

    try {
      setLoading("Sending test command...");

      let script = generateTestLabelScript(LanguageV, {
        speedValue: selectedSpeed,
        darkness: sliderValue,
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
    <MainContainer>
      <MainHeader
        mainContainerStyle={{ paddingVertical: 0 }}
        back
        title="Printer Setting"
      />
      <View style={{ marginTop: SD.hp(10), flex: 1 }}>
        <InfoFieldComp
          title="Print speed"
          children={
            <CustomDropdown
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

        <SectionContainer>
          <View style={styles.textSection}>
            <Text bold size={14} color={AppTheme.Black}>
              Darkness
            </Text>
            <Text bold size={14} color={AppTheme.Black}>
              {sliderValue}
            </Text>
          </View>
          <Slider
            style={styles.sliderStyles}
            minimumValue={-20}
            maximumValue={80}
            minimumTrackTintColor={AppTheme.Primary}
            maximumTrackTintColor={AppTheme.White}
            onValueChange={(val) => {
              setSliderValue(Math.floor(val) * 1);
            }}
            value={sliderValue}
            thumbTintColor={AppTheme.Primary}
          />
        </SectionContainer>
      </View>
      <PrimaryButton
        title="Apply"
        customStyles={{ marginVertical: 0 }}
        onPress={handleSetValues}
      />
      <PrimaryButton title="Print Sample Label" onPress={handleTestValues} />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

export default PrinterSettingNested;
