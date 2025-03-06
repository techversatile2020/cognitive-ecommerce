import { View, Text, Pressable, StyleSheet } from "react-native";
import { BLEService } from "../services";

function BluetoothScannedDevice({ device, onPress }) {
  return (
    <View style={styles.outterContainer}>
      <Pressable onPress={onPress}>
        <View style={styles.innerContainer}>
          <View>
            <Text>{device.name}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default BluetoothScannedDevice;

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  outterContainer: {
    margin: 4,
    backgroundColor: "#fff",
    elevation: 3,
    padding: 10,
  },
  pressStyle: {
    flex: 1,
  },
});
