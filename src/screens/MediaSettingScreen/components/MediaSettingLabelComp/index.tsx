import { useState } from "react";
import {
  CustomDropdown,
  CustomTextInput,
  IncreamentDecreamentComp,
  InfoFieldComp,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { styles } from "./styles";
import { useTheme } from "../../../../hooks";
import { ScrollView, View } from "react-native";
const MediaSettingLabelComp = () => {
  const [selectedSpeed, setSelectedSpeed] = useState<string | number>("1");
  const [speedData, setSpeedData] = useState([
    {
      label: "Gap",
      value: "1",
    },
    {
      label: "Notch",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();
  const [modelNumber, setModelNumber] = useState(null);
  const [printWidth, setPrintWidth] = useState<any>(0);
  const [shiftLeft, setShiftLeft] = useState<any>(0);

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
          <InfoFieldComp
            title="Model Number"
            children={
              <CustomTextInput
                placeholder="Enter model number"
                value={modelNumber}
                setValue={(e) => setModelNumber(e)}
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
        </View>
        <PrimaryButton
          title="Start Calibration"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
        />
        <PrimaryButton title="Apply" customStyles={{ borderRadius: 15 }} />
        <PrimaryButton
          title="Test Print"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
        />
      </ScrollView>
    </MainContainer>
  );
};
export default MediaSettingLabelComp;
