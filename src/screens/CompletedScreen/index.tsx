import { StyleSheet, View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { SD } from "../../utils";
import { useTheme } from "../../hooks";

const CompletedScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  return (
    <MainContainer>
      <MainHeader back />
      <View style={{ flex: 1, alignItems: "center", top: SD.hp(10) }}>
        <Text bold size={30} centered color={AppTheme.Black}>
          Completed!
        </Text>
        <CustomImage
          source={Images.successPrinter2}
          style={styles.deviceImage}
        />
      </View>
      <PrimaryButton
        title="Next"
        customStyles={{ borderRadius: 15 }}
        onPress={() =>
          navigation.replace(ScreenNames.PrinterSettingScreen, {
            IP_Address: route?.params?.IP_Address,
          })
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  deviceImage: {
    width: SD.wp(161),
    height: SD.hp(158),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: SD.hp(90),
  },
});

export default CompletedScreen;
