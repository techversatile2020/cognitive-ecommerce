// AuthContainer.tsx
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  StyleProp,
} from "react-native";
import { SD } from "../../utils";
import { PrimaryButton } from "../primary-button";
import Text from "../text";
import { useTheme } from "../../hooks";
import { Images, NavigationService } from "../../config"; // Navigation ke liye
import { Fonts } from "../../styles";

interface AuthContainerProps {
  title: string;
  children: React.ReactNode;
  buttonTitle: string;
  onButtonPress?: () => void;
  footerText?: string;
  footerActionText?: string;
  onFooterPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showFooter?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  children,
  buttonTitle,
  onButtonPress,
  footerText = "Don’t have an account? ",
  footerActionText = "Sign Up",
  onFooterPress,
  containerStyle,
  contentStyle,
  showFooter = true,
  showBackButton = true, // ✅ default true
  onBackPress,
}) => {
  const { AppTheme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backBtnWrapper}
            activeOpacity={0.7}
            onPress={onBackPress || (() => NavigationService.goBack())}
          >
            <Image style={styles.backBtn} source={Images.BackBtn} />
          </TouchableOpacity>
        )}
        <Image
          style={[
            styles.logo,
            {
              marginLeft: showBackButton ? SD.wp(40) : SD.wp(80),
            },
          ]}
          source={Images.logo}
        />
      </View>

      {/* Title */}
      <Text color={AppTheme.Black} bold size={34} style={styles.title}>
        {title}
      </Text>

      {/* Children */}
      <View style={[styles.content, contentStyle]}>{children}</View>

      {/* Primary Button */}
      <PrimaryButton
        fontSize={16}
        customStyles={styles.button}
        title={buttonTitle}
        onPress={onButtonPress}
      />

      {/* Footer */}
      {showFooter && (
        <View style={styles.footer}>
          <Text size={14}>{footerText}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onFooterPress}>
            <Text size={14} color={AppTheme.fontBlueL}>
              {footerActionText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    marginTop: SD.hp(40),
    alignItems: "center",
  },
  backBtnWrapper: {
    padding: SD.hp(5),
  },
  backBtn: {
    width: SD.wp(40),
    height: SD.hp(40),
    marginTop: SD.hp(-12),
  },
  logo: {
    width: SD.wp(210),
    height: SD.hp(40),
  },
  title: {
    marginTop: SD.hp(50),
  },
  content: {
    width: "100%",
    marginTop: SD.hp(55),
  },
  button: {
    width: "100%",
    marginTop: SD.hp(40),
    fontSize: 16,
    fontFamily: Fonts["Medium"],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SD.hp(18),
  },
});
