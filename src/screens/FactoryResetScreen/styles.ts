import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  networkIconView: {
    borderRadius: 100,
    width: SD.wp(137),
    height: SD.hp(137),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: SD.hp(15),
  },
  networkIcon: {
    width: SD.wp(57),
    height: SD.hp(57),
    resizeMode: "contain",
  },
});
