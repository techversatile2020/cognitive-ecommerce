import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  sectionContainerStyles: {
    height: SD.hp(179),
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftView: {
    width: "50%",
  },
  AddNowBtn: {
    width: SD.wp(96),
    height: SD.hp(27),
    borderRadius: 4,
  },
  printerImage: {
    width: "40%",
    height: "80%",
    resizeMode: "contain",
  },
  optionsSection: {
    marginTop: SD.hp(20),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    // alignContent:'space-around'
  },
});
