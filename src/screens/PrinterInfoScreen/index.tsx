import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { styles } from "./styles";
import { Images } from "../../config";
import { useTheme } from "../../hooks";
const PrinterInfoScreen = () => {
  const { AppTheme } = useTheme();

  return (
    <MainContainer>
      <MainHeader
        mainContainerStyle={{
          paddingTop: 0,
        }}
        back
        title="Printer Info"
      />
      <View style={{ flex: 1, alignItems: "center" }}>
        <CustomImage source={Images.printer} style={styles.deviceImage} />
        <Text bold size={24} color={AppTheme.Black} topSpacing={20}>
          CTPG5824
        </Text>
        <Text regular size={14} color={AppTheme.fontGray} topSpacing={10}>
          Printer Cognitive
        </Text>
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
        <SectionContainer containerStyles={styles.sectionContainerStyles}>
          <InforTextTable title="Model Name" value="CTPG-MODEL-XYZ" />
          <InforTextTable title="Serial Number" value="L123456" />
          <InforTextTable title="Firmware Version" value="195170.898" />
          <InforTextTable title="Wifi Firm Version" value="1.0.0" />
          <InforTextTable title="Index Setting" value="tt mode" />
        </SectionContainer>
      </View>

      <PrimaryButton title="Remove" customStyles={{ borderRadius: 15 }} />
    </MainContainer>
  );
};

const InforTextTable = ({ title, value }) => {
  const { AppTheme } = useTheme();
  return (
    <View
      style={{ ...styles.infoTextTableView, borderBottomColor: AppTheme.White }}
    >
      <Text regular size={12} color={AppTheme.Primary} left>
        {title}
      </Text>
      <Text regular size={12} color={AppTheme.Black} right>
        {value}
      </Text>
    </View>
  );
};
export default PrinterInfoScreen;
