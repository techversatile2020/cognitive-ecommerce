import { View } from "react-native";
import {
  CustomImage,
  InfoFieldComp,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images } from "../../config";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
const NetworkInformationScreen = () => {
  const { AppTheme } = useTheme();
  return (
    <MainContainer>
      <MainHeader
        title="Network Information"
        back
        mainContainerStyle={{ paddingVertical: 0 }}
      />
      <View style={styles.container}>
        <SectionContainer containerStyles={styles.networkIconView}>
          <CustomImage source={Images.wifiRound} style={styles.networkIcon} />
        </SectionContainer>
        <View
          style={{
            ...styles.connectedTextView,
            backgroundColor: AppTheme.lightGreen,
          }}
        >
          <Text bold size={10} color={AppTheme.White} centered>
            Connected
          </Text>
        </View>
        <View style={styles.infoFieldSection}>
          <InfoFieldComp title="Router Name" value="Xfinity" />
          <InfoFieldComp title="Signal Strength" value="Good" />
          <InfoFieldComp title="IP Address" value="192.168.0.0" />
        </View>
      </View>
      <PrimaryButton
        title="Connect to another Network"
        customStyles={{
          borderRadius: 15,
        }}
      />
    </MainContainer>
  );
};

export default NetworkInformationScreen;
