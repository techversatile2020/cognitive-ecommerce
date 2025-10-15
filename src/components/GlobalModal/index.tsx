import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { ModalComponent } from "../ModalComponent";
import { EditProfileModal } from "../EditProfileModal";
import { ChangePasswordModal } from "../ChangePasswordModal";

export type ModalType =
  | "editProfile"
  | "changePassword"
  | "privacyPolicy"
  | "termsConditions"
  | "helpSupport"
  | null;

interface GlobalModalProps {
  isVisible: boolean;
  type: ModalType;
  onClose: () => void;
}

const GlobalModal = ({ isVisible, type, onClose }: GlobalModalProps) => {
  const { AppTheme } = useTheme();
  const getTitle = () => {
    switch (type) {
      case "editProfile":
        return "Edit Profile";
      case "changePassword":
        return "Change Password";
      case "privacyPolicy":
        return "Privacy Policy";
      case "termsConditions":
        return "Terms & Conditions";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (type) {
      case "editProfile":
        return <EditProfileModal modalType={"editProfile"} onPress={onClose} />;
      case "changePassword":
        return (
          <ChangePasswordModal modalType={"changePassword"} onPress={onClose} />
        );
      case "privacyPolicy":
      // return <PrivacyAndPolicyModal />;
      case "termsConditions":
      // return <TermsAndConditionsModal />;
      case "helpSupport":
        return null;
    }
  };

  return (
    <ModalComponent
      type={type}
      isVisible={isVisible}
      onClose={onClose}
      title={getTitle()}
    >
      {renderContent()}
    </ModalComponent>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    minWidth: "80%",
  },
  closeText: {
    marginTop: 20,
    textAlign: "right",
    color: "blue",
  },
});
