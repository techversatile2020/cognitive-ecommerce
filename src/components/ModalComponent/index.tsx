import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { MainContainer } from "../main-container";
import { BackHeader } from "../back-header";
import { CustomImage } from "../custom-image";
import { Images } from "../../config";
import { SD } from "../../utils";

export const ModalComponent = ({
  isVisible,
  onClose,
  title,
  children,
  type,
}: any) => {
  const { AppTheme } = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              // height: type == 'changePassword' ? '88%' : '100%',
            },
          ]}
        >
          <MainContainer
            isFlatList
            mainContainerStyle={{
              borderRadius: 30,
              backgroundColor: AppTheme.Base,
              // backgroundColor: 'red',
            }}
          >
            {/* <BackHeader /> */}
            <Pressable onPress={onClose}>
              <CustomImage
                source={Images.BackBtn}
                style={{ width: SD.wp(30), height: SD.wp(30) }}
              />
            </Pressable>
            {children}
          </MainContainer>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    justifyContent: "flex-end",
    flex: 1,
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: "red",
  },
});
