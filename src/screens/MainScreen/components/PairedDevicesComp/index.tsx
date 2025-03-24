import { Pressable, View } from "react-native";
import { CustomImage, Text } from "../../../../components";
import { styles } from "./styles";
import { Images, ScreenNames } from "../../../../config";
import { useTheme } from "../../../../hooks";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type propsObj = {
  id: number;
  title: string;
  subTitlel: string;
  status: string;
  connected: string;
};

const PairedDevicesComp = ({ data }: { data: propsObj }) => {
  const { AppTheme } = useTheme();
  const { title, subTitlel, status, connected } = data;
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleNavigation = () => {
    navigation.navigate(ScreenNames.PrinterSettingScreen);
  };
  return (
    <View style={[styles.container, { backgroundColor: AppTheme.White }]}>
      <Pressable
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            opacity: status == "Ready" ? 1 : 0.5,
          },
        ]}
        onPress={handleNavigation}
      >
        <View
          style={[
            styles.deviceImageView,
            { backgroundColor: AppTheme.skyBlue },
          ]}
        >
          <CustomImage source={Images.printer2} style={styles.deviceImage} />
        </View>
        <View style={styles.textView}>
          <Text bold size={12} color={AppTheme.Black}>
            {title}
          </Text>
          <Text regular size={10} color={AppTheme.fontGray}>
            {subTitlel}
          </Text>
        </View>
        <View style={styles.statusView}>
          <Text bold size={10} color={AppTheme.Black} centered>
            Status
          </Text>
          <Text
            regular
            size={10}
            color={status == "Ready" ? AppTheme.lightGreen : AppTheme.fontGray}
            centered
          >
            {status}
          </Text>
        </View>
        <View>
          {/* <Text bold size={10} color={AppTheme.Black}>
          Connected
          </Text> */}
          <Text bold size={10} color={AppTheme.Black} centered>
            {connected}
          </Text>
        </View>
        <Pressable onPress={() => setShowRemoveBtn(!showRemoveBtn)}>
          <CustomImage
            source={Images.verticalDots}
            style={styles.verticalDots}
          />
        </Pressable>
      </Pressable>
      {showRemoveBtn && <RemoveComp />}
    </View>
  );
};

const RemoveComp = () => {
  const { AppTheme } = useTheme();
  return (
    <View style={styles.removeCompContainer}>
      <CustomImage
        source={Images.bin}
        style={[styles.binIcon, { backgroundColor: "#FFFFFF" }]}
      />
      <Text regular size={10}>
        Remove
      </Text>
    </View>
  );
};

export default PairedDevicesComp;
