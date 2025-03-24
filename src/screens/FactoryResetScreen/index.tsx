import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";

const FactoryResetScreen = ({ navigation }) => {
  const { AppTheme } = useTheme();
  const handleYes = () => {
    navigation.navigate(ScreenNames.CompletedScreen);
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <MainContainer>
      <MainHeader back title="Reset Password" />
      <SectionContainer containerStyles={styles.networkIconView}>
        <CustomImage source={Images.wifiRound} style={styles.networkIcon} />
      </SectionContainer>
      <View style={{ flex: 1, paddingHorizontal: SD.wp(40) }}>
        <Text bold size={18} color={AppTheme.Black} centered topSpacing={20}>
          Are you sure to do factory reset?
        </Text>
        <Text
          regular
          size={14}
          color={AppTheme.fontGray}
          centered
          topSpacing={10}
          style={{ lineHeight: 20 }}
        >
          This will wipe out all printer variables and set all variables to
          default values
        </Text>
      </View>
      <PrimaryButton
        title="Yes"
        customStyles={{ borderRadius: 15, marginVertical: 0 }}
        onPress={handleYes}
      />
      <PrimaryButton
        title="Back"
        customStyles={{ borderRadius: 15 }}
        onPress={handleGoBack}
      />
    </MainContainer>
  );
};

export default FactoryResetScreen;
