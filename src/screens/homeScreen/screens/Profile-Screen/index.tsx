import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Images } from "../../../../config";
import InfoSection from "../../../../components/infoSection";
import {
  GlobalModal,
  MainContainer,
  MainHeader,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { useTheme } from "../../../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../../../redux/reducers/auth.slice";

interface AccountOption {
  id: string;
  title: string;
  icon: any;
}

interface ProfileHeaderProps {
  name: string;
  email: string;
}

const accountOptions: AccountOption[] = [
  { id: "1", title: "Profile Settings", icon: Images.profileSetting },
  { id: "2", title: "Change Password", icon: Images.lockIcon },
  { id: "3", title: "Delete", icon: Images.deleteIcon },
  { id: "4", title: "Logout", icon: Images.logout },
];

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
}) => {
  const { AppTheme } = useTheme();
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
    return initials.slice(0, 2);
  };

  return (
    <View style={styles.profileContainer}>
      <View style={[styles.avatar, { backgroundColor: AppTheme.lightBlue }]}>
        <Text color="#868D94" regular size={26}>
          {getInitials(name)}
        </Text>
      </View>

      <Text color={AppTheme.Black} bold size={20}>
        {name}
      </Text>
      <Text color="#868D94" regular size={14}>
        {email}
      </Text>
    </View>
  );
};

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: any) => state.auth);
  console.log("user => ", user);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const renderItem: ListRenderItem<AccountOption> = ({ item }) => {
    const handlePress = () => {
      if (item.id == "4") {
        return Alert.alert(
          "Logout Confirmation",
          "Are you sure you want to logout?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Logout cancelled"),
              style: "cancel",
            },
            {
              text: "Logout",
              onPress: () => {
                // Clear user data, token, etc.
                console.log("User logged out");
                // Example: navigate to Login screen
                // navigation.replace("Login");
                dispatch(setToken(null));
                dispatch(setUser({}));
              },
              style: "destructive",
            },
          ],
          { cancelable: true }
        );
      }
      if (item.id == "3") {
        return Alert.alert(
          "Delete Confirmation",
          "Are you sure you want to delete your account?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Logout cancelled"),
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => {
                // Clear user data, token, etc.
                console.log("User logged out");
                // Example: navigate to Login screen
                // navigation.replace("Login");
                dispatch(setToken(null));
                dispatch(setUser({}));
              },
              style: "destructive",
            },
          ],
          { cancelable: true }
        );
      }
      setShowModal(true);
      setModalType(() => (item.id == "1" ? "editProfile" : "changePassword"));
    };
    return (
      <InfoSection
        source={item?.icon}
        title={item.title}
        containerStyle={styles.infoSectionContainer}
        onPress={handlePress}
      />
    );
  };

  return (
    <MainContainer>
      <MainHeader back title="Profile" />
      <View style={styles.screenContainer}>
        <FlatList
          ListHeaderComponent={
            <>
              <ProfileHeader
                name={`${user.firstName} ${user?.lastName}`}
                email={user?.email}
              />
              <View
                style={[{ paddingBottom: SD.hp(30), borderColor: "#868D94" }]}
              />
            </>
          }
          data={accountOptions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
        <GlobalModal
          isVisible={showModal}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      </View>
    </MainContainer>
  );
};

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SD.hp(25),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: SD.wp(75),
    height: SD.wp(75),
    borderRadius: SD.wp(60),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SD.hp(12),
  },
  infoSectionContainer: {
    marginBottom: SD.hp(15),
  },
  flatListContent: {
    paddingBottom: SD.hp(20),
  },
});
