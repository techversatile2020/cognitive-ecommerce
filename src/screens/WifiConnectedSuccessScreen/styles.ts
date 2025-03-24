import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
  },
  iconContainer: {
    height: SD.hp(137),
    width: SD.wp(137),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  iconsView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  verticalLine: {
    width: SD.wp(2),
    height: SD.hp(56.5),
    backgroundColor: "red",
    // position: "absolute",
  },
  statusIcon: {
    height: SD.hp(70),
    width: SD.wp(70),
    resizeMode: "contain",
  },
});
