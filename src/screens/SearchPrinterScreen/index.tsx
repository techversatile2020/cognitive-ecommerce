import { ScrollView, View } from "react-native";
import { styles } from "./styles";
import {
  CustomImage,
  CustomModal,
  MainContainer,
  MainHeader,
  ParingConnectionCard,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { useState } from "react";
import { dummyData } from "./extra/dummyData";
import { SD } from "../../utils";

const SearchPrinterScreen = ({ navigation }) => {
  const { AppTheme } = useTheme();
  const [printerSelected, setPrinterSelected] = useState(null);
  const [showPrinterErrorModal, setShowPrinterErrorModal] = useState(false);

  const handleNext = () => {
    navigation.navigate(ScreenNames.ConnectWifiScreen);
  };

  const handlePrinterConnect = (id) => {
    if (id == "2") {
      setPrinterSelected(null);
      return setShowPrinterErrorModal(true);
    }
    setPrinterSelected(id);
  };

  return (
    <MainContainer customeStyle={{ paddingTop: SD.hp(0) }}>
      <MainHeader
        back={true}
        title="Search Printer"
        // mainContainerStyle={{ paddingTop: SD.hp(0) }}
      />
      <CustomImage source={Images.printerOutline} style={styles.printerIcon} />
      <Text
        bold
        color={AppTheme.Black}
        size={18}
        centered
        topSpacing={15}
        bottomSpacing={15}
      >
        Select a printer from list {"\n"}below to connect
      </Text>
      <View style={styles.sectionView}>
        <Text regular size={10} color={AppTheme.fontGray}>
          Printer should be within 6 ft of the device.
        </Text>
        <SectionContainer containerStyles={styles.printerSectionContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {dummyData.map((item, index) => {
              return (
                <ParingConnectionCard
                  circle
                  isActive={item.id == printerSelected}
                  heading={item.name}
                  subHeading={item.subheading}
                  onPress={() => handlePrinterConnect(item.id)}
                  key={index}
                  icon={item.icon}
                />
              );
            })}
          </ScrollView>
        </SectionContainer>
      </View>
      <PrinterConnectionErrorModal
        isVisible={showPrinterErrorModal}
        onClose={() => setShowPrinterErrorModal(false)}
      />
      <PrimaryButton
        title="Next"
        customStyles={styles.nextBtn}
        onPress={handleNext}
      />
    </MainContainer>
  );
};

const PrinterConnectionErrorModal = ({ isVisible, onClose }) => {
  const { AppTheme } = useTheme();
  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={{ ...styles.modalContainer, backgroundColor: AppTheme.White }}
      >
        <CustomImage source={Images.failPrinter} style={styles.deviceIcon} />
        <Text bold size={18} color={AppTheme.Black}>
          Unable to Connect Printer
        </Text>
        <Text
          regular
          size={14}
          color={AppTheme.fontGray}
          centered
          width={270}
          topSpacing={20}
          bottomSpacing={20}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore.
        </Text>
        <View style={styles.modalBtnsView}>
          <PrimaryButton
            title="Cancel"
            customStyles={{
              flex: 2,
              marginHorizontal: SD.wp(5),
              borderRadius: 15,
            }}
            onPress={onClose}
          />
          <PrimaryButton
            title="Retry"
            customStyles={{ flex: 2, borderRadius: 15 }}
          />
        </View>
      </View>
    </CustomModal>
  );
};
export default SearchPrinterScreen;
