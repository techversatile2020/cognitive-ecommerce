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
import { styles } from "./styles";
import { useTheme } from "../../../../hooks";
import { useState } from "react";
import { SD } from "../../../../utils";
export const AdvanceSettingConnectComp = () => {
  const [selectedIpAssignment, setSelectedIpAssignment] = useState<
    string | number
  >("1");
  const [ipAssignments, setIpAssignments] = useState([
    {
      label: "Static",
      value: "1",
    },
    {
      label: "Dynamic",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();
  const [IPAddress, setIPAddress] = useState(null);
  const [netMask, setnetMask] = useState(null);
  const [getWayIPAddress, setGetWayIPAddress] = useState(null);
  return (
    <MainContainer
      customeStyle={{
        // marginTop: SD.hp(20),
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
            title="IP Assignment Mode"
            children={
              <CustomDropdown
                iconColor={AppTheme.Primary}
                data={ipAssignments}
                onChange={setSelectedIpAssignment}
                value={selectedIpAssignment}
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
            title="IP Address"
            children={
              <CustomTextInput
                placeholder="192.168.0.0"
                value={IPAddress}
                setValue={(e) => setIPAddress(e)}
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
            title="Netmask"
            children={
              <CustomTextInput
                placeholder="255.255.255.0"
                value={netMask}
                setValue={(e) => setnetMask(e)}
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
            title="Gateway IP Address"
            children={
              <CustomTextInput
                placeholder="255.255.255.0"
                value={getWayIPAddress}
                setValue={(e) => setGetWayIPAddress(e)}
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
