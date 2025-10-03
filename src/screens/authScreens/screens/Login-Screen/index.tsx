import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
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
import { EMPTY } from "rxjs";
import { AuthScreenNames } from "../../../../config/ScreenNames";

export const LoginScreen = () => {
  const { AppTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    console.log("Login pressed with email:", email);
  };

  const handleSignupRedirect = () => {
    console.log("Go to Signup");
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
      >
        {/* Email */}
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={styles.input}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          fontSize={16}
        />

        {/* Password with Eye Toggle */}
        <CustomTextInput
          ref={passwordRef}
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={!showPassword}
          icon={showPassword ? Images.eye : Images.eyeOff}
          onIconPress={() => setShowPassword(!showPassword)}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[styles.input, { marginTop: SD.hp(25) }]}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          fontSize={16}
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
  eyeIcon: {
    width: SD.hp(20),
    height: SD.hp(20),
    tintColor: "#7C8BA0",
  },

  secondaryText: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SD.hp(20),
  },
});
