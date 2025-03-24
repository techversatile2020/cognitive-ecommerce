import { useState } from "react";
import {
  CustomDropdown,
  InfoFieldComp,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { View } from "react-native";
import { SD } from "../../utils";
import Slider from "@react-native-community/slider";

const PrinterSettingNested = () => {
  const [selectedSpeed, setSelectedSpeed] = useState<string | number>("1");
  const [speedData, setSpeedData] = useState([
    {
      label: "5 Inches/Second",
      value: "1",
    },
    {
      label: "10 Inches/Second",
      value: "2",
    },
  ]);
  const [sliderValue, setSliderValue] = useState(20);

  const { AppTheme } = useTheme();
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
            minimumValue={0}
            maximumValue={50}
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
      <PrimaryButton title="Apply" customStyles={{ marginVertical: 0 }} />
      <PrimaryButton title="Print Sample Label" />
    </MainContainer>
  );
};

export default PrinterSettingNested;
