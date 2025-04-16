import { useState } from "react";
import {
  CustomTouchable,
  MainContainer,
  MainHeader,
  SectionContainer,
  Text,
} from "../../components";
import { useTheme } from "../../hooks";
import { styles } from "./styles";
import {
  AdvanceSettingConnectComp,
  AdvanceSettingMediaComp,
  AdvanceSettingPrinterComp,
} from "./components";
import { useSelector } from "react-redux";
const AdvanceSettingScreen = ({ route }) => {
  const { AppTheme } = useTheme();
  const { IPConfig, IP_Address, NetMask, GatewayIP, LanguageV, TOFAdj } =
    useSelector(
      (state: any) =>
        state.printer.printerDetailsByIp[route?.params?.IP_Address]
    );
  const [activeBar, setActiveBar] = useState("Connection");
  const [barOptions, setBarOptions] = useState([
    "Connection",
    "Printer",
    "Media",
  ]);

  return (
    <MainContainer>
      <MainHeader
        back
        title="Advance Printer Setting"
        mainContainerStyle={{ paddingVertical: 0 }}
      />
      <SectionContainer
        containerStyles={{
          ...styles.headerContainer,
        }}
      >
        {barOptions.map((item, index) => {
          return (
            <CustomTouchable
              style={{
                ...styles.headerBtn,
                backgroundColor: activeBar == item ? AppTheme.White : null,
              }}
              onPress={() => setActiveBar(item)}
              key={index}
            >
              <Text
                bold
                size={14}
                color={activeBar == item ? AppTheme.Black : AppTheme.Primary}
              >
                {item}
              </Text>
            </CustomTouchable>
          );
        })}
      </SectionContainer>
      {activeBar == "Connection" && (
        <AdvanceSettingConnectComp
          data={{ IPConfig, IP_Address, NetMask, GatewayIP, LanguageV }}
        />
      )}
      {activeBar == "Media" && (
        <AdvanceSettingMediaComp data={{ TOFAdj, IP_Address, LanguageV }} />
      )}
      {activeBar == "Printer" && (
        <AdvanceSettingPrinterComp data={{ LanguageV, IP_Address }} />
      )}
    </MainContainer>
  );
};

export default AdvanceSettingScreen;
