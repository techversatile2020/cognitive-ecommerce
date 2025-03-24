import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  deviceImage: {
    borderRadius: 100,
    width: SD.wp(160),
    height: SD.hp(160),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    resizeMode: "contain",
  },
  networkIcon: {
    width: SD.wp(57),
    height: SD.hp(57),
    resizeMode: "contain",
  },
  connectedTextView: {
    width: SD.wp(80),
    height: SD.hp(22),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginVertical: SD.hp(10),
    alignSelf: "center",
  },
  sectionContainerStyles: {
    backgroundColor: "#F2F5F9",
    width: "100%",
  },
  infoTextTableView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SD.hp(10),
    borderBottomWidth: 1,
  },
});
