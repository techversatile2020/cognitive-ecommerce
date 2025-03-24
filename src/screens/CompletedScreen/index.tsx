import { StyleSheet, View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../components";
import { Images } from "../../config";
import { SD } from "../../utils";

const CompletedScreen = () => {
  return (
    <MainContainer>
      <MainHeader back />
      <View style={{ flex: 1 }}>
        <Text bold size={30} centered>
          Completed
        </Text>
        <CustomImage
          source={Images.successPrinter}
          style={styles.deviceImage}
        />
      </View>
      <PrimaryButton title="Next" customStyles={{ borderRadius: 15 }} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  deviceImage: {
    width: SD.wp(165),
    height: SD.hp(165),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: SD.hp(100),
  },
});

export default CompletedScreen;
