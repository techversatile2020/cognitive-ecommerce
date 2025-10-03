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
import { Images } from "../../config";
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
}) => {
  const { AppTheme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Logo */}
      <Image style={styles.logo} source={Images.logo} />

      {/* Title */}
      <Text color={AppTheme.Black} bold size={34} style={styles.title}>
        {title}
      </Text>

      {/* Content */}
      <View style={[styles.content, contentStyle]}>{children}</View>

      {/* Primary Button */}
      <PrimaryButton
        fontSize={16}
        customStyles={styles.button}
        title={buttonTitle}
        onPress={onButtonPress}
      />

      {/* Footer (Optional) */}
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
  logo: {
    width: SD.wp(210),
    height: SD.hp(40),
    marginTop: SD.hp(40),
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
