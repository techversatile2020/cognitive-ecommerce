import { Text, View, Image, StyleSheet } from "react-native";

function PrinterDescription({ name, imageUri, description }) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageUri} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

export default PrinterDescription;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Align items in a row (horizontally)
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, color: "#666" },
});
