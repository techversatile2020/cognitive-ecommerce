import { View } from "react-native";
import {
  CustomTouchable,
  MainContainer,
  MainHeader,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { useState } from "react";
import { MediaSettingLabelComp, MediaSettingReceiptComp } from "./components";

const MediaSettingScreen = () => {
  const { AppTheme } = useTheme();
  const [activeBar, setActiveBar] = useState("label");
  return (
    <MainContainer mainContainerStyle={{ paddingTop: 0 }}>
      <MainHeader
        mainContainerStyle={{ paddingTop: 0 }}
        back
        title="Media Setting"
      />
      <SectionContainer
        containerStyles={{
          ...styles.headerContainer,
        }}
      >
        <CustomTouchable
          style={{
            ...styles.headerBtn,
            backgroundColor: activeBar == "label" ? AppTheme.White : null,
          }}
          onPress={() => setActiveBar("label")}
        >
          <Text
            bold
            size={14}
            color={activeBar == "label" ? AppTheme.Black : AppTheme.Primary}
          >
            Label
          </Text>
        </CustomTouchable>
        <CustomTouchable
          style={{
            ...styles.headerBtn,
            backgroundColor: activeBar == "receipt" ? AppTheme.White : null,
          }}
          onPress={() => setActiveBar("receipt")}
        >
          <Text
            bold
            size={14}
            color={activeBar == "receipt" ? AppTheme.Black : AppTheme.Primary}
          >
            Receipt
          </Text>
        </CustomTouchable>
      </SectionContainer>
      {activeBar == "label" && <MediaSettingLabelComp />}
      {activeBar == "receipt" && <MediaSettingReceiptComp />}
    </MainContainer>
  );
};

export default MediaSettingScreen;
