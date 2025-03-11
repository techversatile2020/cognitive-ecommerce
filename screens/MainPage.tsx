import { View, Text, StyleSheet, FlatList } from "react-native";
import PrinterDescription from "../components/PrinterDescription";
import ConnectedPrinterItem from "../components/ConnectedPrinterItem";
import { useEffect, useState } from "react";
import { MainContainer } from "../src/components";

function MainPage({ route, navigation }) {
  const [connectedPrinters, setConnectedPrinters] = useState([]);

  useEffect(() => {
    setConnectedPrinters((prevPrinterslst) => {
      if (route?.params?.ipAddr) {
        return [
          ...prevPrinterslst,
          {
            name: "cognitiveprinter",
            ipAddr: route.params.ipAddr,
          },
        ];
      }
      return prevPrinterslst;
    });
  }, [route?.params?.ipAddr]);

  // if (route && route.params && route.params.ipAddr) {
  //   if ("ipAddr" in route.params) {
  //     const newPrinterIpAddr = route.params.ipAddr;
  //     console.log(`hello: ${newPrinterIpAddr}`);
  //     setConnectedPrinters((prevPrinterslst) => {
  //       return [
  //         ...prevPrinterslst,
  //         {
  //           name: "cognitiveprinter",
  //           ipAddr: newPrinterIpAddr,
  //         },
  //       ];
  //     });
  //   }
  // }

  // const connectedPrinter = [
  //   {
  //     key: 1,
  //     name: "testprinter",
  //     ipAddr: "192.168.1.111",
  //   },
  //   {
  //     key: 2,
  //     name: "colorprinter",
  //     ipAddr: "192.168.1.112",
  //   },
  // ];
  return (
    <MainContainer>
      <View style={styles.connectedPrinterContainer}>
        <Text style={styles.title}>Connected printer</Text>
        <FlatList
          style={styles.list}
          data={connectedPrinters}
          // keyExtractor={({ item }) => item.ipAddr}
          renderItem={({ item }) => (
            <ConnectedPrinterItem
              printName={item.name}
              ipAddr={item.ipAddr}
              onPress={() => navigation.navigate("Printer")}
            />
          )}
        />
      </View>
      <View style={styles.printersDescription}>
        <Text style={styles.title}>Printers Description</Text>
        <PrinterDescription
          name="2 Inch Label Printer"
          imageUri={require("./../assets/dlx-2-inch.jpg")}
          description="Robust and rugged are the hallmarks of our thermal label printers. The DLXi combines this legendary reliability with the latest communication interfaces and performance."
        />
        <PrinterDescription
          name="4 Inch Label Printer"
          imageUri={require("./../assets/dlx-4-inch.jpg")}
          description="Robust and rugged are the hallmarks of our thermal label printers. The DLXi combines this legendary reliability with the latest communication interfaces and performance."
        />
      </View>
    </MainContainer>
  );
}

export default MainPage;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    height: "30%",
    margin: 10,
  },
  printersDescription: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    margin: 10,
  },
  connectedPrinterContainer: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    margin: 10,
  },
});
