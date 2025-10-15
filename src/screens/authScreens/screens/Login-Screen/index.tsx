import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import {
  AuthContainer,
  CustomTextInput,
  Loader,
  MainContainer,
  Text,
} from "../../../../components";
import { useTheme } from "../../../../hooks/useTheme";
import { SD, Toast } from "../../../../utils";
import { Fonts } from "../../../../styles";
import { Images, NavigationService } from "../../../../config";
import {
  AuthScreenNames,
  BottomTabScreenNames,
  ScreenNames,
} from "../../../../config/ScreenNames";
import { useAuth } from "../../../../graphql";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../../../redux/reducers/auth.slice";

export const LoginScreen = () => {
  const { AppTheme } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const { login, getCustomer } = useAuth();

  const handleLogin = async () => {
    let valid = true;

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    // Basic email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    }
    if (!valid) return;
    setLoading(true);

    let responce = await login({
      email,
      password,
    });

    if (responce?.customerAccessToken?.accessToken) {
      let getMe = await getCustomer(responce?.customerAccessToken?.accessToken);
      if (getMe) {
        console.log("In iF getMe => ", { getMe, responce });
        setLoading(false);
        dispatch(setUser(getMe));
        dispatch(setToken(responce?.customerAccessToken?.accessToken));
      }
    } else {
      console.log("!responce.customerAccessToken");
      setLoading(false);

      Toast.fail(
        responce?.customerUserErrors[0]?.message,
        "Login failed",
        true
      );
    }
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
        {passwordError ? (
          <Text
            size={10}
            color="red"
            style={{ marginTop: SD.hp(5), marginLeft: SD.wp(10) }}
          >
            {passwordError}
          </Text>
        ) : null}

        <View style={styles.secondaryText}>
          <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Text color="#7C8BA0" size={14}>
              Forget Password?
            </Text>
          </TouchableOpacity>
        </View>
        <Loader visible={loading} text="Loading..." />
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
