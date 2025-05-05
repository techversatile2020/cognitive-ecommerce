import { View } from "react-native";
import {
  CustomImage,
  Loader,
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
import { useState } from "react";
import { sendRequest } from "../../services/printerServices";
import { toast } from "../../utils/toast.utils";

const FactoryResetScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [loading, setLoading] = useState(null);
  const handleYes = async () => {
    // navigation.navigate(ScreenNames.CompletedScreen);
    setLoading("Reseting...");
    try {
      const responseHtml = await sendRequest({
        ip: route?.params?.IP_Address,
        endpoint: "factoryreset.cgi",
        method: "POST",
        responseType: "text", // since it returns HTML
      });

      if (responseHtml.includes("Factory Reset Completed")) {
        setTimeout(() => {
          setLoading(null);
          navigation.replace(ScreenNames.CompletedScreen, {
            IP_Address: route?.params?.IP_Address,
          });
        }, 2000);
      } else {
        throw new Error("Unexpected response from device");
      }
    } catch (err) {
      setLoading(null);

      console.log(err);

      toast.fail(
        "Fail",
        "Factory reset failed. Please check device connection."
      );
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <MainContainer>
      <MainHeader back title="Factory Reset" />
      <SectionContainer containerStyles={styles.networkIconView}>
        <CustomImage source={Images.factoryReset} style={styles.networkIcon} />
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
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

export default FactoryResetScreen;
