import React, { useState } from "react";
import { StyleSheet } from "react-native";
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
import { useAuth } from "../../../../graphql";

export const ForgotPassword = () => {
  const { AppTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { recover } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleForgotPassword = async () => {
    // Reset previous error
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    // ✅ Proceed with your reset password logic
    console.log("Forgot password requested for:", email);
    setLoading(true);
    await recover(email);
    setLoading(false);
  };

  return (
    <MainContainer isFlatList>
      <AuthContainer
        title="Forgot Password"
        buttonTitle="Send Reset Password"
        onButtonPress={handleForgotPassword}
        showFooter={false}
      >
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={(text) => {
            setEmail(text);
            if (emailError && text.trim()) setEmailError("");
          }}
          placeholderTextColor={"#7C8BA0"}
          textColor={AppTheme.Black}
          containerStyles={[
            styles.input,
            emailFocused && {
              borderWidth: 1,
              borderColor: AppTheme.Primary,
            },
            // emailError && { borderWidth: 1, borderColor: "red" },
          ]}
          returnKeyType="done"
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
      </AuthContainer>
      <Loader visible={loading} text="Sending reset link..." />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f3f5f9",
    borderRadius: SD.hp(14),
    height: SD.hp(50),
    marginTop: SD.hp(10),
    paddingLeft: SD.wp(24),
    fontFamily: Fonts["Regular"],
  },
});
