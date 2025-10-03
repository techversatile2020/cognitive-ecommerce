import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  AuthContainer,
  CustomTextInput,
  MainContainer,
} from "../../../../components";
import { useTheme } from "../../../../hooks/useTheme";
import { SD } from "../../../../utils";
import { Fonts } from "../../../../styles";

export const ForgotPassword = () => {
  const { AppTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const handleForgotPassword = () => {
    console.log("Forgot password requested for:", email);
    // 👉 yahan tum apni API call kar sakte ho
  };

  return (
    <MainContainer isFlatList>
      <AuthContainer
        title="Forgot Password"
        buttonTitle="Send Reset Password"
        onButtonPress={handleForgotPassword}
        showFooter={false} // 👈 Footer hide kar diya (optional)
      >
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
          returnKeyType="done"
          fontSize={16}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
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
    marginTop: SD.hp(10),
    paddingLeft: SD.wp(24),
    fontFamily: Fonts["Regular"],
  },
});
