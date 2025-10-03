import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import {
  AuthContainer,
  CustomTextInput,
  MainContainer,
  Text,
} from "../../../../components";
import { useTheme } from "../../../../hooks/useTheme";
import { SD } from "../../../../utils";
import { Fonts } from "../../../../styles";
import { Images, NavigationService } from "../../../../config";
import {
  AuthScreenNames,
  BottomTabScreenNames,
} from "../../../../config/ScreenNames";

export const LoginScreen = () => {
  const { AppTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    console.log("Login pressed with email:", email);
    NavigationService.navigate(BottomTabScreenNames.Home);
  };

  const handleSignupRedirect = () => {
    NavigationService.navigate(AuthScreenNames.SignupScreen);
  };

  const handlePress = () => {
    NavigationService.navigate(AuthScreenNames.ForgotPassword);
  };

  return (
    <MainContainer isFlatList>
      <AuthContainer
        title="Sign In"
        buttonTitle="Log in"
        onButtonPress={handleLogin}
        onFooterPress={handleSignupRedirect}
        showBackButton={false}
      >
        {/* Email */}
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            emailFocused && {
              borderWidth: 1,
              borderColor: AppTheme.Primary,
            },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          fontSize={16}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />

        {/* Password with Eye Toggle */}
        <CustomTextInput
          inputRef={passwordRef}
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={!showPassword}
          icon={showPassword ? Images.eye : Images.eyeOff}
          onIconPress={() => setShowPassword(!showPassword)}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            { marginTop: SD.hp(25) },
            passwordFocused && {
              borderWidth: 1,
              borderColor: AppTheme.Primary,
            },
          ]}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          fontSize={16}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />

        <View style={styles.secondaryText}>
          <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Text color="#7C8BA0" size={14}>
              Forget Password?
            </Text>
          </TouchableOpacity>
        </View>
      </AuthContainer>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f3f5f9",
    borderRadius: SD.hp(14),
    height: SD.hp(50),
    marginTop: SD.hp(10),
    paddingHorizontal: SD.hp(10),
    fontFamily: Fonts["Regular"],
    paddingLeft: SD.wp(24),
  },
  secondaryText: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SD.hp(20),
  },
});
