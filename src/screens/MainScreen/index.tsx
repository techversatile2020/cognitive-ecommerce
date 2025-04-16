import { View, ScrollView } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "./../../components";
import { SD } from "../../utils";
import { Images, ScreenNames } from "../../config";
import { styles } from "./styles";
import { MainScreenOptionsCard, PairedDevicesComp } from "./components";
import { opetionsData } from "./extra/data";
import { useTheme } from "../../hooks";
import { pairedDevicesData } from "./extra/pairedDevicesData";
import { useSelector } from "react-redux";

function MainScreen({ navigation, route }) {
  const { isDarkTheme, AppTheme } = useTheme();
  const { connectedPrinters } = useSelector((state: any) => state.printer);
  const { printerDetailsByIp } = useSelector((state: any) => state.printer);
  const printerList = Object.values(printerDetailsByIp ?? {});
  const setup = printerList.length > 0;

  const handleAddNow = () => {
    navigation.navigate(ScreenNames.PrinterSetupScreen);
  };

  return (
    <MainContainer isFlatList>
      <MainHeader logo showPlusIcon={setup} />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: SD.hp(30) }}
      >
        <SectionContainer
          containerStyles={[
            styles.sectionContainerStyles,
            setup && {
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingHorizontal: SD.wp(0),
              alignItems: "center",
            },
          ]}
        >
          {setup ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {printerList.map((item, index) => {
                return <PairedDevicesComp data={item} key={index} />;
              })}
            </ScrollView>
          ) : (
            <>
              <View style={styles.leftView}>
                <Text bold size={22} blackBold>
                  Add Your {"\n"}First Printer
                </Text>
                <Text
                  regular
                  size={12}
                  color={AppTheme.fontGray}
                  topSpacing={10}
                  bottomSpacing={10}
                >
                  Add Your printer add see the listing of your printer fast
                </Text>
                <PrimaryButton
                  title="+ Add Now"
                  fontSize={12}
                  customStyles={styles.AddNowBtn}
                  onPress={handleAddNow}
                />
              </View>
              <CustomImage
                source={Images.printer}
                style={styles.printerImage}
              />
            </>
          )}
        </SectionContainer>
        <View style={styles.optionsSection}>
          {opetionsData.map((item, index) => (
            <MainScreenOptionsCard
              icon={item.icon}
              heading={item.heading}
              subHeading={item.subHeading}
              key={index}
            />
          ))}
        </View>
      </ScrollView>
    </MainContainer>
  );
}

export default MainScreen;
