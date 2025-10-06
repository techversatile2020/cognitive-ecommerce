import React from "react";
import { FlatList, ListRenderItem, View, StyleSheet } from "react-native";
import { Images } from "../../../../config";
import InfoSection from "../../../../components/infoSection";
import { MainContainer, MainHeader, Text } from "../../../../components";
import { SD } from "../../../../utils";
import { useTheme } from "../../../../hooks";

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
  { id: "2", title: "Change Password", icon: Images.logout },
  { id: "5", title: "Delete", icon: Images.logout },
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
  const renderItem: ListRenderItem<AccountOption> = ({ item }) => (
    <InfoSection
      source={item?.icon}
      title={item.title}
      containerStyle={styles.infoSectionContainer}
    />
  );

  return (
    <MainContainer>
      <MainHeader back title="Profile" />
      <View style={styles.screenContainer}>
        <FlatList
          ListHeaderComponent={
            <>
              <ProfileHeader name="John Doe" email="johndoe@gmail.com" />
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
