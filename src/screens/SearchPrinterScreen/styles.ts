import { StyleSheet } from "react-native";
import { SD } from "../../utils";
import { Fonts, ThemeColors } from "../../styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  printerIcon: {
    width: SD.wp(137),
    height: SD.hp(137),
    resizeMode: "contain",
    alignSelf: "center",
  },
  sectionView: {
    flex: 1,
  },
  printerSectionContainer: {
    borderRadius: 10,
    marginTop: SD.hp(10),
    height: SD.hp(298),
    overflow: "scroll",
    paddingBottom: SD.hp(10),
  },
  nextBtn: {
    borderRadius: 15,
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    padding: SD.hp(20),
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SD.hp(40),
  },
  deviceIcon: {
    width: SD.wp(137),
    height: SD.hp(137),
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: SD.hp(20),
  },
  modalBtnsView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SD.hp(40),
  },
});
