import { useState } from "react";
import {
  IncreamentDecreamentComp,
  InfoFieldComp,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { styles } from "./styles";
import { View } from "react-native";
export const AdvanceSettingMediaComp = () => {
  const [formAdjust, setFormAdjust] = useState<any>(0);
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
          title="Print Width (Inches)"
          children={
            <IncreamentDecreamentComp
              value={formAdjust}
              setValue={(e) => setFormAdjust(e)}
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
    </MainContainer>
  );
};
