import React, { useState, useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import {
  AuthContainer,
  CustomTextInput,
  MainContainer,
} from "../../../../components";
import { useTheme } from "../../../../hooks/useTheme";
import { SD } from "../../../../utils";
import { Fonts } from "../../../../styles";
import { Images } from "../../../../config";

export const SignupScreen = () => {
  const { AppTheme } = useTheme();

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Refs for focusing next input
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignup = () => {
    console.log("Signup with:", { name, email, password, confirmPassword });
    // 👉 yahan tum apna API call karna
  };

  const handleLoginRedirect = () => {
    console.log("Go to Login screen");
  };

  return (
    <MainContainer isFlatList>
      <AuthContainer
        title="Sign Up"
        buttonTitle="Create Account"
        onButtonPress={handleSignup}
        footerText="Already have an account? "
        footerActionText="Login"
        onFooterPress={handleLoginRedirect}
      >
        {/* Name */}
        <CustomTextInput
          placeholder="Full Name"
          value={name}
          setValue={setName}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            nameFocused && { borderWidth: 1, borderColor: AppTheme.Primary },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          fontSize={16}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
        />

        {/* Email */}
        <CustomTextInput
          ref={emailRef}
          placeholder="Email"
          value={email}
          setValue={setEmail}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            emailFocused && { borderWidth: 1, borderColor: AppTheme.Primary },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          fontSize={16}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />

        {/* Password */}
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
          containerStyles={[
            styles.input,
            passwordFocused && {
              borderWidth: 1,
              borderColor: AppTheme.Primary,
            },
          ]}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          fontSize={16}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />

        {/* Confirm Password */}
        <CustomTextInput
          ref={confirmPasswordRef}
          placeholder="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          icon={showConfirmPassword ? Images.eye : Images.eyeOff}
          onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            confirmPasswordFocused && {
              borderWidth: 1,
              borderColor: AppTheme.Primary,
            },
          ]}
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          fontSize={16}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
        />
      </AuthContainer>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f3f5f9",
    borderRadius: SD.hp(14),
    height: SD.hp(50),
    marginTop: SD.hp(15),
    paddingLeft: SD.hp(24),
    fontFamily: Fonts["Regular"],
  },
  icon: {
    width: SD.hp(20),
    height: SD.hp(20),
    resizeMode: "contain",
  },
});
