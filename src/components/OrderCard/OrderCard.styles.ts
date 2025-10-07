import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: SD.hp(10),
    paddingHorizontal: SD.wp(10),
    borderRadius: SD.wp(20),
  },
  cardContainer: {
    borderRadius: SD.hp(14),
    padding: SD.hp(10),
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  imageWrapper: {
    width: SD.hp(72),
    height: SD.hp(68),
    borderRadius: SD.hp(14),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SD.hp(50),
    height: SD.hp(50),
  },
  detailsContainer: {
    marginLeft: SD.wp(10),
    width: "45%",
    height: SD.hp(60),
    justifyContent: "center",
  },
  statusContainer: {
    width: "28%",
    height: SD.hp(60),
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  optionSelector: {
    width: SD.wp(20),
    height: SD.wp(20),
    borderColor: "#CECECE",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  tickImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  bottomRow: {
    width: "100%",
    marginTop: SD.hp(10),
    paddingHorizontal: SD.wp(5),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  reorderButton: {
    width: SD.wp(90),
    height: SD.hp(33),
    borderRadius: SD.wp(10),
    marginVertical: 0,
  },
});
