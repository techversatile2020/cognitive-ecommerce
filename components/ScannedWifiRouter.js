import { View, Text, Pressable, StyleSheet } from "react-native";

function ScannedWifiRouter({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.pressStyle, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.outterContainer}>
        <View style={styles.innerContainer}>
          <View>
            <Text>{children}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default ScannedWifiRouter;

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  outterContainer: {
    margin: 4,
    backgroundColor: "#ccc",
    elevation: 3,
    padding: 10,
  },
  pressStyle: {
    flex: 1,
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
