import * as RequestPub from "./../../protos/request_pb";
import * as CommonPub from "./../../protos/common_pb";
import * as ResponsePub from "./../../protos/response_pb";
import * as ResultPub from "./../../protos/result_pb";
// const request = new RequestPub.Request();

export const connectAndSendWifi = async (
  deviceId,
  serviceUUID,
  characteristicUUID,
  ssid,
  password
) => {
  //   try {
  //     // Step 1: Create Wifi object
  //     const wifi = new Wifi();
  //     wifi.setSsid(Buffer.from(ssid, "utf-8"));
  //     wifi.setPassword(Buffer.from(password, "utf-8"));
  //     wifi.setSecurity(Security.SECURITY_WPA2); // Or SECURITY_OPEN, SECURITY_WEP, etc.
  //     // Step 2: Create Request object and set command + wifi payload
  //     const request = new Request();
  //     request.setCommand(CommandType.COMMAND_CONNECT_WIFI);
  //     request.setWifi(wifi);
  //     // Step 3: Serialize request to binary, encode to base64 for BLE
  //     const binary = request.serializeBinary();
  //     const base64data = Buffer.from(binary).toString("base64");
  //     // Step 4: Send via BLE to the printer
  //     const bleService = new BLEService();
  //     await bleService.connectToDevice(deviceId);
  //     await bleService.writeCharacteristic(
  //       serviceUUID,
  //       characteristicUUID,
  //       base64data
  //     );
  //   } catch (error) {
  //     console.error("Failed to connect and send WiFi:", error);
  //   }
};
