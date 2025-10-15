// components/Loader.tsx
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ViewStyle,
} from "react-native";
import { BlurView } from "@react-native-community/blur";

interface LoaderProps {
  visible: boolean;
  text?: string;
  fullScreen?: boolean; // 👈 new: determines if modal or inline
  blur?: boolean; // 👈 new: optional blur effect
  style?: ViewStyle; // 👈 optional custom style for inline mode
}

const Loader: React.FC<LoaderProps> = ({
  visible,
  text = "Loading...",
  fullScreen = true,
  blur = true,
  style,
}) => {
  if (!visible) return null;

  // 🔹 FULL-SCREEN (modal) mode
  if (fullScreen) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.container}>
          {blur && (
            <BlurView style={styles.blur} blurType="light" blurAmount={10} />
          )}
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // 🔹 INLINE (section) mode
  return (
    <View style={[styles.inlineContainer, style]}>
      {blur && (
        <BlurView style={styles.blur} blurType="light" blurAmount={10} />
      )}
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  inlineContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: 10,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
