import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  AuthContainer,
  CustomTextInput,
  Loader,
  MainContainer,
  Text,
} from "../../../../components";
import { useTheme } from "../../../../hooks/useTheme";
import { SD } from "../../../../utils";
import { Fonts } from "../../../../styles";
import { Images, NavigationService } from "../../../../config";
import { AuthScreenNames } from "../../../../config/ScreenNames";
import { useAuth } from "../../../../graphql";

export const SignupScreen = () => {
  const { AppTheme } = useTheme();

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Scroll handling
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewPaddingBottom, setScrollViewPaddingBottom] = useState(
    SD.hp(100)
  );

  // Refs for focusing next input
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  //auth hooks
  const { signup } = useAuth();

  const handleSignup = async () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }
    setLoading(true);

    if (!valid) return;
    let firstName = name?.split(" ")[0];
    let lastName = name?.split(" ")[1] || null;
    let response = await signup({
      firstName,
      lastName,
      email,
      password,
    });
    setLoading(false);
  };

  const handleLoginRedirect = () => {
    NavigationService.reset_0(AuthScreenNames.LoginScreen);
  };

  // 🔹 helper: handle focus scroll and padding
  const handleFocus = (inputName: string, scrollY: number) => {
    setScrollViewPaddingBottom(SD.hp(150));

    switch (inputName) {
      case "name":
        setNameFocused(true);
        break;
      case "email":
        setEmailFocused(true);
        break;
      case "password":
        setPasswordFocused(true);
        break;
      case "confirmPassword":
        setConfirmPasswordFocused(true);
        break;
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: scrollY,
        animated: true,
      });
    }, 150);
  };

  const handleBlur = (field: string) => {
    switch (field) {
      case "name":
        setNameFocused(false);
        break;
      case "email":
        setEmailFocused(false);
        break;
      case "password":
        setPasswordFocused(false);
        break;
      case "confirmPassword":
        setConfirmPasswordFocused(false);
        break;
    }
    setScrollViewPaddingBottom(SD.hp(0));
  };

  return (
    <MainContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scrollViewPaddingBottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthContainer
            title="Sign Up"
            buttonTitle="Create Account"
            onButtonPress={handleSignup}
            footerText="Already have an account? "
            footerActionText="Login"
            onFooterPress={handleLoginRedirect}
            showFooter
          >
            {/* Name */}
            <CustomTextInput
              placeholder="Full Name"
              value={name}
              setValue={setName}
              placeholderTextColor="#7C8BA0"
              textColor={AppTheme.Black}
              containerStyles={[
                styles.input,
                nameFocused && {
                  borderWidth: 1,
                  borderColor: AppTheme.Primary,
                },
              ]}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              fontSize={16}
              onFocus={() => handleFocus("name", SD.hp(0))}
              onBlur={() => handleBlur("name")}
            />
            {nameError ? (
              <Text
                size={10}
                color="red"
                style={{ marginTop: SD.hp(5), marginLeft: SD.wp(10) }}
              >
                {nameError}
              </Text>
            ) : null}

            {/* Email */}
            <CustomTextInput
              inputRef={emailRef}
              placeholder="Email"
              value={email}
              setValue={setEmail}
              placeholderTextColor="#7C8BA0"
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
              // onFocus={() => handleFocus("email", SD.hp(100))}
              onBlur={() => handleBlur("email")}
            />
            {emailError ? (
              <Text
                size={10}
                color="red"
                style={{ marginTop: SD.hp(5), marginLeft: SD.wp(10) }}
              >
                {emailError}
              </Text>
            ) : null}

            {/* Password */}
            <CustomTextInput
              inputRef={passwordRef}
              placeholder="Password"
              value={password}
              setValue={setPassword}
              secureTextEntry={!showPassword}
              icon={showPassword ? Images.eye : Images.eyeOff}
              onIconPress={() => setShowPassword(!showPassword)}
              placeholderTextColor="#7C8BA0"
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
              onFocus={() => handleFocus("password", SD.hp(100))}
              onBlur={() => handleBlur("password")}
            />
            {passwordError ? (
              <Text
                size={10}
                color="red"
                style={{ marginTop: SD.hp(5), marginLeft: SD.wp(10) }}
              >
                {passwordError}
              </Text>
            ) : null}

            {/* Confirm Password */}
            <CustomTextInput
              inputRef={confirmPasswordRef}
              placeholder="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              icon={showConfirmPassword ? Images.eye : Images.eyeOff}
              onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholderTextColor="#7C8BA0"
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
              onFocus={() => handleFocus("confirmPassword", SD.hp(150))}
              onBlur={() => handleBlur("confirmPassword")}
            />
            {confirmPasswordError ? (
              <Text
                size={10}
                color="red"
                style={{ marginTop: SD.hp(5), marginLeft: SD.wp(10) }}
              >
                {confirmPasswordError}
              </Text>
            ) : null}
          </AuthContainer>
          <Loader visible={loading} text="Loading..." />
        </ScrollView>
      </KeyboardAvoidingView>
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
});
