import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";

import { BLEService } from "../services";
import Button from "../components/UI/Button";
import BluetoothScannedDevice from "../components/BluetoothScannedDevice";
import { fullUUID } from "react-native-ble-plx";
import { Colors } from "../constants/colors";
import ScannedWifiRouter from "../components/ScannedWifiRouter";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

const version_pb = require("../protos/version_pb");
const request_pb = require("../protos/request_pb");
const common_pb = require("../protos/common_pb");
const response_pb = require("../protos/response_pb");
const result_pb = require("../protos/result_pb");

function AddPrinter() {
  const [bleScannedDevices, setBleScannedDevices] = useState([]);
  const [bleConnectionStatus, setBleConnectionStatus] = useState("none");
  const [wifiScannedDevices, setWifiScannedDevices] = useState([]);

  const navigation = useNavigation();

  function updateBleConnectionStatus(state) {
    setBleConnectionStatus(state);
  }

  function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  function addFoundDevice(device) {
    if (device.name) {
      setBleScannedDevices((prevDevices) => {
        if (
          !prevDevices.some((existDevice) => existDevice.name === device.name)
        ) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    }
  }

  async function ScanButtonHandler() {
    BLEService.initializeBLE().then(() =>
      BLEService.scanDevices(addFoundDevice, [
        "14387800-130c-49e7-b877-2881c89cb258",
      ])
    );
    return;
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function ConnectWifiRouter(wifiInfo) {
    console.log(`connecting to ${bin2String(wifiInfo.getWifi().getSsid())}`);
    const request = new request_pb.Request();
    const wifiConfig = new request_pb.WifiConfig();
    const connectWifiInfo = new common_pb.WifiInfo();
    connectWifiInfo.setSsid(wifiInfo.getWifi().getSsid());
    connectWifiInfo.setBssid(wifiInfo.getWifi().getBssid());
    connectWifiInfo.setBand(wifiInfo.getWifi().getBand());
    connectWifiInfo.setChannel(wifiInfo.getWifi().getChannel());
    connectWifiInfo.setAuth(wifiInfo.getWifi().getAuth());
    wifiConfig.setPassphrase([]); // TODO: manually set the wi-fi passphrase here.
    wifiConfig.setWifi(connectWifiInfo);
    request.setConfig(wifiConfig);
    request.setOpCode(common_pb.OpCode.SET_CONFIG);
    console.log(`debug: ${request.serializeBinary()}`);
    await BLEService.writeCharacteristicWithResponseForDevice(
      "14387800-130c-49e7-b877-2881c89cb258",
      "14387802-130c-49e7-b877-2881c89cb258",
      btoa(String.fromCharCode(...new Uint8Array(request.serializeBinary())))
    );
    await timeout(4000);
    console.log(`get status`);
    const statusRequest = new request_pb.Request();
    statusRequest.setOpCode(common_pb.OpCode.GET_STATUS);
    await BLEService.writeCharacteristicWithResponseForDevice(
      "14387800-130c-49e7-b877-2881c89cb258",
      "14387802-130c-49e7-b877-2881c89cb258",
      btoa(
        String.fromCharCode(...new Uint8Array(statusRequest.serializeBinary()))
      )
    );
  }

  function listener1(error, characteristic) {
    console.log("listener1");
    const response = response_pb.Response.deserializeBinary(
      base64ToArrayBuffer(characteristic.value)
    );
    if (response.hasDeviceStatus()) {
      console.log(
        `connection info: ${response.getDeviceStatus().getConnectionInfo()}`
      );
      const ipAddr = `${
        response.getDeviceStatus().getConnectionInfo().getIp4Addr()[0]
      }.${response.getDeviceStatus().getConnectionInfo().getIp4Addr()[1]}.${
        response.getDeviceStatus().getConnectionInfo().getIp4Addr()[2]
      }.${response.getDeviceStatus().getConnectionInfo().getIp4Addr()[3]}.`;
      navigation.navigate("MainPage", {
        ipAddr: ipAddr,
      });
    }
  }

  function listener2(error, characteristic) {
    const resultVal = base64ToArrayBuffer(characteristic.value);
    const result = result_pb.Result.deserializeBinary(resultVal);
    if (result.hasScanRecord()) {
      const scanRecord = result.getScanRecord();
      const ssid = bin2String(scanRecord.getWifi().getSsid());
      if (ssid) {
        setWifiScannedDevices((prevScanRecords) => {
          if (
            !prevScanRecords.some((existScanRecord) => {
              return bin2String(existScanRecord.getWifi().getSsid()) === ssid;
            })
          ) {
            return [...prevScanRecords, scanRecord];
          }
          return prevScanRecords;
        });
      }
    }
  }

  async function ConnectButtonHandler(device) {
    console.log(`Connecting to ${device.name}`);
    BLEService.connectToDevice(device.id)
      .then((device) => {
        console.log("connected");
        updateBleConnectionStatus("connected");
        return BLEService.discoverAllServicesAndCharacteristicsForDevice();
      })
      .then((device) => {
        console.log("found services");
        return BLEService.readCharacteristicForDevice(
          fullUUID("14387800-130c-49e7-b877-2881c89cb258"),
          fullUUID("14387801-130c-49e7-b877-2881c89cb258")
        );
      })
      .then((data) => {
        const version_info = base64ToArrayBuffer(data.value);
        const version = version_pb.Info.deserializeBinary(version_info);
        console.log(`version info: ${version.getVersion()}`);

        return BLEService.monitorCharacteristicForService(
          "14387800-130c-49e7-b877-2881c89cb258",
          "14387802-130c-49e7-b877-2881c89cb258",
          listener1
        );
      })
      .then((data) => {
        return BLEService.monitorCharacteristicForService(
          "14387800-130c-49e7-b877-2881c89cb258",
          "14387803-130c-49e7-b877-2881c89cb258",
          listener2
        );
      })
      .then((data) => {
        return BLEService.requestMTUForDevice(200);
      })
      .then((data) => {
        const req = new request_pb.Request();
        req.setOpCode(common_pb.OpCode.START_SCAN);
        const reqBase64 = btoa(
          String.fromCharCode(...new Uint8Array(req.serializeBinary()))
        );
        return BLEService.writeCharacteristicWithoutResponseForDevice(
          "14387800-130c-49e7-b877-2881c89cb258",
          "14387802-130c-49e7-b877-2881c89cb258",
          reqBase64
        );
      })
      .then((data) => {
        console.log("start wifi");
      })
      .catch((err) => {
        console.log(`failed: ${err}`);
        updateBleConnectionStatus("connectFailed");
      });
  }

  return (
    <View style={styles.outterContainer}>
      <View style={styles.innerContainer}>
        <Button onPress={ScanButtonHandler}>Scan devices</Button>
      </View>
      <View>
        <FlatList
          style={styles.list}
          data={bleScannedDevices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BluetoothScannedDevice
              device={item}
              onPress={ConnectButtonHandler.bind(this, item)}
            />
          )}
        />
      </View>
      <Text style={styles.wifiScanTitle}>WiFi Router Selection:</Text>
      <View>
        <FlatList
          style={styles.list}
          data={wifiScannedDevices}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ScannedWifiRouter onPress={ConnectWifiRouter.bind(this, item)}>
              {bin2String(item.getWifi().getSsid())}
            </ScannedWifiRouter>
          )}
        />
      </View>
    </View>
  );
}

export default AddPrinter;

const styles = StyleSheet.create({
  outterContainer: {
    marginHorizontal: 40,
  },
  innerContainer: {
    marginVertical: 30,
  },
  list: {
    margin: 24,
  },
  wifiScanTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.gray700,
    textAlign: "center",
  },
});
