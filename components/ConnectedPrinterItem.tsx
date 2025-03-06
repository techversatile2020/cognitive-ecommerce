import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ConnectedPrinterItem({ printName, ipAddr, onPress }) {
  console.log(`name: ${printName}, ipAddr: ${ipAddr}`);
  return (
    <View style={styles.outterContainer}>
      <Pressable onPress={onPress}>
        <View style={styles.innerContainer}>
          <Ionicons name="arrow-forward-circle-outline" size={32} />
          <View>
            <Text>{printName}</Text>
            <Text>{ipAddr}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default ConnectedPrinterItem;

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  outterContainer: {
    margin: 24,
    backgroundColor: "#fff",
    elevation: 3,
    padding: 10,
  },
  pressStyle: {
    flex: 1,
  },
});
