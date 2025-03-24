import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  ParingConnectionCard,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { useEffect, useState } from "react";
import { SD } from "../../utils";
import { knownDevices, newDevices } from "./extra/dummyData";
export default function ConnectWifiScreen({ navigation, route }) {
  const [connectedWifi, setConnectedWifi] = useState(1);
  const { AppTheme } = useTheme();

  const handleNext = () => {
    navigation.navigate(ScreenNames.PrinterConnectedSuccessScreen, {
      isSuccess: true,
    });
  };

  useEffect(() => {
    console.log(route?.params);
  }, [route]);

  const handleConnectWifi = (e) => {
    navigation.navigate(ScreenNames.ConnectToWifiPasswordScreen, {
      router: e,
    });
  };

  return (
    <MainContainer customeStyle={{ paddingTop: SD.hp(0) }}>
      <MainHeader back={true} title="Connect to Wifi" />
      <CustomImage source={Images.printerOutline} style={styles.wifiIcon} />
      <Text
        bold
        color={AppTheme.Black}
        size={18}
        centered
        topSpacing={15}
        bottomSpacing={15}
      >
        Select the WiFi network your {"\n"}printer will connect
      </Text>
      <View style={{ flex: 1 }}>
        <SectionContainer containerStyles={styles.wifiSectionContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text bold size={14} color={AppTheme.Black}>
              Known Devices
            </Text>
            {knownDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  isActive={item.id == connectedWifi}
                  heading={item.name}
                  subHeading={item.subheading}
                  onPress={() => setConnectedWifi(item.id)}
                  key={index}
                  icon={item.icon}
                />
              );
            })}
            <Text bold size={14} color={AppTheme.Black} topSpacing={10}>
              New Devices
            </Text>
            {newDevices.map((item, index) => {
              return (
                <ParingConnectionCard
                  isActive={item.id == connectedWifi}
                  heading={item.name}
                  subHeading={item.subheading}
                  onPress={() => handleConnectWifi(item)}
                  key={index}
                  icon={item.icon}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </View>
      <PrimaryButton
        title="Next"
        customStyles={styles.nextBtn}
        onPress={handleNext}
      />
    </MainContainer>
  );
}
