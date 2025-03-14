import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import OutlinedButton from "../components/UI/OutlinedButton";

function Printer() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Printer Configuration</Text>
      <View>
        <Text style={styles.label}>Model Number: DB042-2085-G1E</Text>
        <Text style={styles.label}>FW: 195-170-412 V4.12</Text>
        <Text style={styles.label}>Serial number: z060800000</Text>
        <OutlinedButton onPress={() => {}} icon="add">
          Set printer configuration
        </OutlinedButton>
      </View>
    </View>
  );
}

export default Printer;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 21,
    color: Colors.gray700,
    justifyContent: "center",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    padding: 8,
    borderColor: Colors.primary500,
    borderWidth: 2,
    borderRadius: 4,
  },
});
