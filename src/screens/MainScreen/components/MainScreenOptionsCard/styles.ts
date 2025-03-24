import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Fonts, ThemeColors } from "../../../../styles";

export const styles = StyleSheet.create({
  mainScreenOptionCard: {
    paddingVertical: SD.hp(20),
    width: widthPercentageToDP(42),
    height: SD.hp(133),
    borderRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: SD.hp(5),
    paddingHorizontal: SD.wp(15),
  },
  cardIcon: {
    width: SD.wp(24),
    height: SD.hp(24),
    resizeMode: "contain",
  },
});
