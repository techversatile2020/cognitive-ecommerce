import React, { ReactNode } from "react";
import {
  ColorValue,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import { ToucableFeedback } from "../toucableFeedback";
import { CardContainer } from "../card-container";

type MainContainerProps = {
  children?: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
  hidden?: boolean;
  mainContainerStyle?: StyleProp<ViewStyle>;
  barStyle?: "default" | "light-content" | "dark-content";
  barBg?: string;
  isFlatList?: boolean;
  bgColor?: ColorValue;
};

export const SectionContainer: React.FC<MainContainerProps> = ({
  children,
  containerStyles,
  hidden = false,
  barStyle = "dark-content",
  barBg,
  isFlatList,
  bgColor,
}) => {
  const { AppTheme } = useTheme();
  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS == "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={10}
    // >
    <CardContainer
      onPress={() => {
        console.log("dadada");
      }}
      customStyles={[
        styles.container,
        { backgroundColor: bgColor || AppTheme.lightBlue },
        containerStyles,
      ]}
    >
      {children}
    </CardContainer>
    // {/* <NoInternet isOffline={true} /> */}
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: SD.wp(20),
    paddingTop: SD.hp(10),
    // height:'100%'
  },
});
