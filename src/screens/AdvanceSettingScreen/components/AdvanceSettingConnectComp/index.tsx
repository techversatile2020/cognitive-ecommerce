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
import { usePrinter, useTheme } from "../../../../hooks";
import { useEffect, useState } from "react";
import { SD } from "../../../../utils";
import {
  fetchPrinterDetails,
  sendRequest,
} from "../../../../services/printerServices";
import { setPrinterDetailsByIp } from "../../../../redux/reducers";
import { toast } from "../../../../utils/toast.utils";
import { useDispatch } from "react-redux";
export const AdvanceSettingConnectComp = ({ data }) => {
  const { IPConfig, IP_Address, NetMask, GatewayIP, LanguageV } = data;
  const [selectedIpAssignment, setSelectedIpAssignment] = useState<
    string | number
  >("2");
  const [ipAssignments, setIpAssignments] = useState([
    {
      label: "Static",
      value: "1",
    },
    {
      label: "DHCP",
      value: "2",
    },
  ]);
  const { AppTheme } = useTheme();

  const [IPAddress, setIPAddress] = useState(null);
  const [netMask, setnetMask] = useState(null);
  const [getWayIPAddress, setGetWayIPAddress] = useState(null);
  const [loading, setLoading] = useState(null);
  const { refetch, isRefetching } = usePrinter(IP_Address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (IPConfig) {
      setSelectedIpAssignment("2");
    } else {
      setSelectedIpAssignment("1");
    }
    setIPAddress(IP_Address);
    setnetMask(NetMask);
    setGetWayIPAddress(GatewayIP);
  }, [IPConfig, IP_Address, NetMask, GatewayIP]);

  useEffect(() => {
    if (selectedIpAssignment == "2") {
      setIPAddress(IP_Address);
      setnetMask(NetMask);
      setGetWayIPAddress(GatewayIP);
    }
  }, [selectedIpAssignment]);

  const handleSetValues = async () => {
    if (selectedIpAssignment == "1") {
      let ipConfig = selectedIpAssignment == "1";
      try {
        setLoading(`Updating settings...`);
        let response = await sendRequest({
          ip: IP_Address,
          endpoint: "saveprintervarvalues.cgi",
          method: "POST",
          data: `IPConfig=${ipConfig}&IP_Address=${IPAddress}&NetMask=${netMask}&GatewayIP=${getWayIPAddress}`,
        });
        refetch();
        setLoading(null);
        toast.success(
          "Success setting updated!, Please restart your printer to settings take effect."
        );
      } catch (err) {
        setLoading(null);
        console.log("Setting value error => ", err);
        toast.fail("Failed", "Update failed. ");
      }
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
      <ScrollView
        style={{ flex: 1 }}
        // contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
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
                disable={selectedIpAssignment == "2"}
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
                disable={selectedIpAssignment == "2"}

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
                disable={selectedIpAssignment == "2"}

                // style={{ padding: SD.wp(15) }}
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
      </ScrollView>
    </MainContainer>
  );
};
