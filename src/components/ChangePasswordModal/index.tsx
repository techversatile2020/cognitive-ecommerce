import React, { FC, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { CustomTextInput } from "../custom-textinput";
import { SD, Toast } from "../../utils";
import Text from "../text";
import { PrimaryButton } from "../primary-button";
import { Images } from "../../config";
import { useAuth, useUser } from "../../graphql";
import { useSelector } from "react-redux";
import Loader from "../Loader";

interface ChangePasswordModalProps {
  onPress?: () => void;
  modalType?: any;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  onPress,
  modalType,
}) => {
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [oldPassword, setOldPassowrd] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const oldPasswordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { updatePassword } = useUser();
  const { recover } = useAuth();
  const { token, user } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await recover(user?.email, true);
    setIsLoading(false);
    onPress();
  };

  return (
    <View style={{ paddingTop: SD.hp(20), flex: 1 }}>
      <Text>
        An email with recover password link will be sent to your email address.
      </Text>
      {/* <View style={{ flex: 1 }}>
        <Text topSpacing={10} bottomSpacing={5}>
          Current Password
        </Text>
        <CustomTextInput
          value={oldPassword}
          inputRef={oldPasswordRef}
          eye
          secureTextEntry={!isOldPasswordVisible}
          hidepswdState={isOldPasswordVisible}
          onIconPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
          placeholder="Old Password"
          isIcon
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => newPasswordRef.current?.focus()}
          customStyle={{ fontSize: SD.customFontSize(14) }}
          setValue={setOldPassowrd}
          containerStyles={{
            borderWidth: 1,
            marginVertical: SD.hp(5),
          }}
          icon={isOldPasswordVisible ? Images.eyeClose : Images.eye}
        />
        <Text topSpacing={10} bottomSpacing={5}>
          New Password
        </Text>
        <CustomTextInput
          inputRef={newPasswordRef}
          value={newPassword}
          icon={isNewPasswordVisible ? Images.eyeClose : Images.eye}
          secureTextEntry={!isNewPasswordVisible}
          hidepswdState={isNewPasswordVisible}
          onIconPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          placeholder="New Password"
          isIcon
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          customStyle={{ fontSize: SD.customFontSize(14) }}
          setValue={setNewPassword}
          containerStyles={{
            borderWidth: 1,
            marginVertical: SD.hp(5),
          }}
        />
        <Text topSpacing={10} bottomSpacing={5}>
          Confirm Password
        </Text>
        <CustomTextInput
          inputRef={confirmPasswordRef}
          value={confirmPassword}
          eye
          secureTextEntry={!isConfirmPasswordVisible}
          hidepswdState={isConfirmPasswordVisible}
          onIconPress={() =>
            setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
          }
          placeholder="Confirm Password"
          isIcon
          returnKeyType="done"
          // onSubmitEditing={handleSubmit}
          customStyle={{ fontSize: SD.customFontSize(14) }}
          setValue={setConfirmPassword}
          containerStyles={{
            borderWidth: 1,
            marginVertical: SD.hp(5),
          }}
          icon={isConfirmPasswordVisible ? Images.eyeClose : Images.eye}
        />

        <Text
          //  style={{
          //   width:'70%'
          //  }}
          leftSpacing={10}
          topSpacing={5}
          numberOfLines={2}
          size={12}
          color="red"
        >
          {passwordError}
        </Text>
      </View> */}

      <PrimaryButton title="Send Link" onPress={() => handleSubmit()} />
      <Loader visible={isLoading} text="Updating..." />
    </View>
  );
};

const styles = StyleSheet.create({});
