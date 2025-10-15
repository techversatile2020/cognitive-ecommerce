import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks";
import { CustomTextInput } from "../custom-textinput";
import { SD } from "../../utils";
import { PrimaryButton } from "../primary-button";
import Text from "../text";
import { useSelector } from "react-redux";
import { useAuth, useUser } from "../../graphql";
import Loader from "../Loader";

interface EditProfileModalProps {
  onPress?: () => void;
  modalType?: any;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  onPress,
  modalType,
}) => {
  const { AppTheme } = useTheme();
  const { user, token } = useSelector((state: any) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { updateCustomer } = useUser();
  const { getCustomer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    let parts = name.trim().split(/\s+/); // split by one or more spaces
    let firstName = parts[0];
    let lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
    setIsLoading(true);
    let res = await updateCustomer(token, {
      firstName,
      lastName,
    });
    if (!res?.customerUserErrors?.length) {
      await getCustomer();
    }
    setIsLoading(false);
    onPress();
  };

  useEffect(() => {
    setEmail(user?.email);
    setName(`${user?.firstName} ${user?.lastName}`);
  }, [user]);

  return (
    <View style={{ paddingTop: SD.hp(20), flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text topSpacing={10}>Name:</Text>
        <CustomTextInput
          returnKeyType="next"
          blurOnSubmit={false}
          value={name}
          setValue={setName}
          placeholder="First Name"
          isIcon
          containerStyles={{
            borderWidth: 1,
            marginVertical: SD.hp(5),
          }}
        />
        <Text topSpacing={10}>Email:</Text>

        <CustomTextInput
          value={email}
          placeholder="Email Address"
          isIcon
          disable
          setValue={setEmail}
          containerStyles={{
            borderWidth: 1,
            marginVertical: SD.hp(5),
          }}
        />
      </View>
      <PrimaryButton title="Confirm" onPress={() => handleSubmit()} />
      <Loader visible={isLoading} text="Updating..." />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
  },
  imageWrapper: {
    borderRadius: SD.hp(90),
    padding: SD.hp(10),
    marginBottom: SD.hp(5),
  },
  profileImage: {
    width: SD.wp(106),
    height: SD.hp(106),
    borderRadius: SD.wp(53),
  },
  cameraWrapper: {
    width: SD.wp(26),
    height: SD.hp(26),
    borderRadius: SD.wp(13),
    position: "absolute",
    right: SD.wp(15),
    bottom: SD.hp(10),
    overflow: "hidden",
  },
  cameraIcon: {
    width: "100%",
    height: "100%",
  },
});
