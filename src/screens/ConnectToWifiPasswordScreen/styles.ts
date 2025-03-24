import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: SD.hp(20),
  },
  networkIconView: {
    borderRadius: 100,
    width: SD.wp(137),
    height: SD.hp(137),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  networkIcon: {
    width: SD.wp(57),
    height: SD.hp(57),
    resizeMode: "contain",
  },
});
