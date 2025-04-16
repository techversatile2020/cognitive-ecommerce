import { View } from "react-native";
import {
  CustomDropdown,
  InfoFieldComp,
  Loader,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { usePrinter, useTheme } from "../../../../hooks";
import { sendRequest } from "../../../../services/printerServices";
import { toast } from "../../../../utils/toast.utils";
export const AdvanceSettingPrinterComp = ({ data }) => {
  const { LanguageV, IP_Address } = data;
  const [selectedLanguage, setSelectedLanguage] = useState<string | number>(
    "1"
  );
  const [printerLanguages, setSelectedLanguages] = useState([
    {
      label: "CPL",
      value: "0",
    },
    {
      label: "EPL",
      value: "1",
    },
    {
      label: "ZPL",
      value: "2",
    },
    {
      label: "Auto",
      value: "3",
    },
  ]);

  useEffect(() => {
    setSelectedLanguage(LanguageV);
  }, [LanguageV]);
  const [loading, setLoading] = useState(null);
  const { AppTheme } = useTheme();
  const { refetch } = usePrinter(IP_Address);

  const handleSetValues = async () => {
    try {
      setLoading(`Updating settings...`);
      let response = await sendRequest({
        ip: IP_Address,
        endpoint: "saveprintervarvalues.cgi",
        method: "POST",
        data: `LanguageV=${selectedLanguage}`,
      });
      refetch();
      console.log("values setter response => ", response);
      setLoading(null);
      toast.success("Success setting updated!");
    } catch (err) {
      setLoading(null);
      console.log("Setting value error => ", err);
      toast.fail("Failed", "Update failed.");
    }
  };
  return (
    <MainContainer
      customeStyle={{
        // marginTop: SD.hp(20),
        paddingHorizontal: 0,
        paddingVertical: 0,
        padding: 0,
      }}
    >
      <View style={{ flex: 1 }}>
        <InfoFieldComp
          title="Printer Language"
          children={
            <CustomDropdown
              iconColor={AppTheme.Primary}
              data={printerLanguages}
              onChange={setSelectedLanguage}
              value={selectedLanguage}
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
      </View>
      <PrimaryButton
        title="Apply"
        customStyles={{ borderRadius: 15 }}
        onPress={handleSetValues}
      />
      {/* <PrimaryButton
        title="Test Print"
        customStyles={{ borderRadius: 15, marginVertical: 0 }}
      /> */}
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};
