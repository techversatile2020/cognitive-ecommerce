import { Platform, Pressable, View } from "react-native";
import {
  CustomDropdown,
  CustomImage,
  CustomModal,
  CustomTouchable,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { styles } from "./styles";
import { SD } from "../../utils";
import { PrinterSettingScreenCard } from "./components";
import { cardsDummyData } from "./extra";
import { useState } from "react";
import { Fonts } from "../../styles";

const PrinterSettingScreen = ({ navigation }) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const { AppTheme } = useTheme();

  const handleClick = (el) => {
    switch (el.title.toLowerCase()) {
      case "network information":
        navigation.navigate(ScreenNames.NetworkInformationScreen);
        break;
      case "printer setting":
        navigation.navigate(ScreenNames.PrinterSettingNested);
        break;
      case "media setting":
        navigation.navigate(ScreenNames.MediaSettingScreen);
        break;
      case "advance setting":
        navigation.navigate(ScreenNames.AdvanceSettingScreen);
        break;
      case "open http server":
        console.log(el.title);
        break;
      case "start calibration":
        setShowCalibrationModal(true);
        break;
      case "print diagnostic label":
        console.log(el.title);
        break;
      case "print test label":
        console.log(el.title);
        break;
      case "factory reset":
        navigation.navigate(ScreenNames.FactoryResetScreen);
        break;
      default:
        console.log(null);
        break;
    }
  };

  const triggerCalibrationModal = () => {
    setShowCalibrationModal(!showCalibrationModal);
  };

  return (
    <MainContainer customeStyle={{ paddingTop: 0 }}>
      <MainHeader
        title="Printer Setting"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <SectionContainer
        containerStyles={{ marginTop: SD.hp(100), paddingBottom: SD.hp(10) }}
      >
        <CustomImage source={Images.printer2} style={styles.deviceImage} />
        <Pressable
          onPress={() => navigation.navigate(ScreenNames.PrinterInfoScreen)}
        >
          <Text bold size={24} centered>
            CTPG5824
          </Text>
          <Text regular size={14} color={AppTheme.fontGray} centered>
            Printer Cognitive
          </Text>
        </Pressable>
        <View style={styles.btnsView}>
          <CustomTouchable
            style={[styles.sectionBtn, { backgroundColor: AppTheme.White }]}
          >
            <Text bold size={12}>
              Status
            </Text>
            <Text regular size={12} color={AppTheme.lightGreen}>
              Online
            </Text>
          </CustomTouchable>
          <CustomTouchable
            style={[
              styles.sectionBtn,
              {
                backgroundColor: AppTheme.White,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <CustomImage source={Images.refresh} style={styles.refreshIcon} />
            <Text bold size={17} color={AppTheme.Primary}>
              Refresh
            </Text>
          </CustomTouchable>
        </View>
      </SectionContainer>
      <View style={styles.cardsSection}>
        {cardsDummyData.map((item, index) => (
          <PrinterSettingScreenCard
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={() => handleClick(item)}
          />
        ))}
      </View>
      <CalibrationModal
        isVisible={showCalibrationModal}
        onClose={triggerCalibrationModal}
      />
    </MainContainer>
  );
};

const CalibrationModal = ({ isVisible, onClose }) => {
  const { AppTheme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<string | number>("2");

  const data = [
    { label: "Gap", value: "1" },
    { label: "Bar", value: "2" },
    { label: "Notch", value: "3" },
  ];
  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={[styles.clibModalContainer, { backgroundColor: AppTheme.White }]}
      >
        <View style={styles.clibModalContentContainer}>
          <Text bold size={24} primartColor centered>
            Start Calibration
          </Text>
          <Text
            regular
            size={12}
            color={AppTheme.fontGray}
            bottomSpacing={20}
            topSpacing={10}
          >
            Select Your Media Type
          </Text>
          <CustomDropdown
            data={data}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Pick a color"
            dropdownStyle={{
              ...styles.customDropdownStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            iconColor={AppTheme.Primary}
            placeholderStyle={{
              ...styles.dropdownPlaceHoldertextStyles,
              color: AppTheme.fontGray,
            }}
            itemStyle={{
              ...styles.customItemStyle,
            }}
            containerStyle={{
              ...styles.itemContainerStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            place
            activeColor={AppTheme.White}
            // fontFamily={Fonts["Bold"]}
          />
        </View>

        <PrimaryButton
          title="Calibrate"
          customStyles={styles.modalBtn}
          onPress={onClose}
        />
        <CustomTouchable
          onPress={onClose}
          style={{ marginVertical: SD.hp(12) }}
        >
          <Text bold size={12} color={AppTheme.fontGray}>
            Skip
          </Text>
        </CustomTouchable>
      </View>
    </CustomModal>
  );
};

export default PrinterSettingScreen;
