import { ScrollView, View } from "react-native";
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
import { useState } from "react";
const MediaSettingReceiptComp = () => {
  const [selectedType, setSelectedType] = useState<string | number>("1");
  const [typeData, setTypeData] = useState([
    {
      label: "Direct thermal",
      value: "1",
    },
    {
      label: "In-Direct thermal",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();
  const [printWidth, setPrintWidth] = useState<any>(null);
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
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
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
            title="Print Width (Hundreds of an Inch)"
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
          <InfoFieldComp
            title="Shift Left (Hundreds of an Inch)"
            children={
              <IncreamentDecreamentComp
                value={shiftLeft}
                setValue={(e) => setShiftLeft(e)}
                sign="in"
              />
            }
          />
        </View>

        <PrimaryButton title="Apply" customStyles={{ borderRadius: 15 }} />
        <PrimaryButton
          title="Test Print"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
        />
      </ScrollView>
    </MainContainer>
  );
};
export default MediaSettingReceiptComp;
