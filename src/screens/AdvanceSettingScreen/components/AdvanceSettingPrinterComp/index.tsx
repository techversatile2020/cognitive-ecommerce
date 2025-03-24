import { View } from "react-native";
import {
  CustomDropdown,
  InfoFieldComp,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { styles } from "./styles";
import { useState } from "react";
import { useTheme } from "../../../../hooks";
export const AdvanceSettingPrinterComp = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | number>(
    "1"
  );
  const [printerLanguages, setSelectedLanguages] = useState([
    {
      label: "CPL",
      value: "1",
    },
    {
      label: "GPL",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();
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
      <PrimaryButton title="Apply" customStyles={{ borderRadius: 15 }} />
      <PrimaryButton
        title="Test Print"
        customStyles={{ borderRadius: 15, marginVertical: 0 }}
      />
    </MainContainer>
  );
};
