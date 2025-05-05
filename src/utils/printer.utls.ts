import Toast from "react-native-toast-message";
import { BLEService } from "../../services";
import { base64ToArrayBuffer, bin2String } from "./ble.util";
import { useDispatch, useSelector } from "react-redux";
import {
  addScannedWifi,
  setCurrentConnectedPrinter,
  setError,
  setLoading,
  setScannedWifis,
} from "../redux/reducers";
import { NavigationService, ScreenNames } from "../config";
import { store } from "../redux";
import { toast } from "./toast.utils";
import navigationService from "../config/navigationService";
import { Platform } from "react-native";
import { fullUUID } from "react-native-ble-plx";

const version_pb = require("./../../protos/version_pb");
const request_pb = require("./../../protos/request_pb");
const common_pb = require("./../../protos/common_pb");
const response_pb = require("./../../protos/response_pb");
const result_pb = require("./../../protos/result_pb");

// Define UUID constants at the top
const SERVICE_UUID = "14387800-130c-49e7-b877-2881c89cb258"; // The main service UUID
const CHAR_NOTIFY_UUID = "14387803-130c-49e7-b877-2881c89cb258"; // NOTIFY characteristic UUID
const CHAR_WRITE_UUID = "14387802-130c-49e7-b877-2881c89cb258"; // WRITE characteristic UUID
const CHAR_VERSION_UUID = "14387801-130c-49e7-b877-2881c89cb258"; // Version characteristic UUID (added as per your code)

export async function ConnectButtonHandler({
  device,
  setLoading,
  scannedWifis,
  dispatch,
  listener1,
  listener2,
}) {
  try {
    setLoading(`Connecting to ${device.name}`);
    dispatch(setScannedWifis([]));

    // 1. Connect and initialize device
    const connectedDevice = await BLEService.connectToDevice(device.id);
    console.log("Connected to device:", connectedDevice.id);

    // 2. Discover services and characteristics
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();

    // 3. Request maximum MTU size
    await BLEService.requestMTUForDevice(500);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 4. Set up characteristic monitors
    //listener 1
    await BLEService.monitorCharacteristicForService(
      SERVICE_UUID,
      CHAR_WRITE_UUID,
      listener1
    );

    // listener2
    await BLEService.monitorCharacteristicForService(
      SERVICE_UUID,
      CHAR_NOTIFY_UUID,
      listener2
    );

    // 5. Read device version information
    await BLEService.readCharacteristicForDevice(
      SERVICE_UUID,
      CHAR_VERSION_UUID
    );

    // 6. Send scan command
    const scanRequest = new request_pb.Request();
    scanRequest.setOpCode(common_pb.OpCode.START_SCAN);
    const requestPayload = btoa(
      String.fromCharCode(...new Uint8Array(scanRequest.serializeBinary()))
    );

    await BLEService.writeCharacteristicWithoutResponseForDevice(
      SERVICE_UUID,
      CHAR_WRITE_UUID,
      requestPayload
    );

    if (Platform.OS === "ios") {
      try {
        // Get scan status or results
        const statusRequest = new request_pb.Request();
        statusRequest.setOpCode(common_pb.OpCode.START_SCAN);

        const statusPayload = btoa(
          String.fromCharCode(
            ...new Uint8Array(statusRequest.serializeBinary())
          )
        );

        await BLEService.writeCharacteristicWithResponseForDevice(
          SERVICE_UUID,
          CHAR_WRITE_UUID,
          statusPayload
        );
      } catch (error) {
        console.log("iOS polling error:", error);
      }
    }

    // 8. Update application state
    dispatch(setCurrentConnectedPrinter(device));
    console.log("WiFi scan initiated successfully");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(null);

    return {};
  } catch (error) {
    console.error("Connection process failed:", error);
    setLoading(null);

    return { error: error?.message, status: "fail" };
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ConnectWifiRouter = async (wifiInfo, wifiPassword, setLoading) => {
  return new Promise(async (resolve, reject) => {
    if (!wifiPassword || !wifiInfo) {
      reject({ messgae: "Please enter wifi password" });
      return Toast.show({
        type: "error",
        text1: "Please enter wifi password",
      });
    }
    try {
      setLoading(`connecting to ${bin2String(wifiInfo.getWifi().getSsid())}`);

      const request = new request_pb.Request();
      const wifiConfig = new request_pb.WifiConfig();
      const connectWifiInfo = new common_pb.WifiInfo();
      connectWifiInfo.setSsid(wifiInfo.getWifi().getSsid());
      connectWifiInfo.setBssid(wifiInfo.getWifi().getBssid());
      connectWifiInfo.setBand(wifiInfo.getWifi().getBand());
      connectWifiInfo.setChannel(wifiInfo.getWifi().getChannel());
      connectWifiInfo.setAuth(wifiInfo.getWifi().getAuth());
      wifiConfig.setPassphrase(
        new Uint8Array([...wifiPassword].map((char) => char.charCodeAt(0)))
      );
      wifiConfig.setWifi(connectWifiInfo);
      request.setConfig(wifiConfig);
      request.setOpCode(common_pb.OpCode.SET_CONFIG);
      await BLEService.writeCharacteristicWithResponseForDevice(
        "14387800-130c-49e7-b877-2881c89cb258",
        "14387802-130c-49e7-b877-2881c89cb258",
        btoa(String.fromCharCode(...new Uint8Array(request.serializeBinary())))
      );
      setLoading("Waiting for device to connect to WiFi...");
      await timeout(10000);
      const statusRequest = new request_pb.Request();
      statusRequest.setOpCode(common_pb.OpCode.GET_STATUS);
      await BLEService.writeCharacteristicWithResponseForDevice(
        "14387800-130c-49e7-b877-2881c89cb258",
        "14387802-130c-49e7-b877-2881c89cb258",
        btoa(
          String.fromCharCode(
            ...new Uint8Array(statusRequest.serializeBinary())
          )
        )
      );
      await timeout(1000);
      setLoading(null);
      resolve({});
    } catch (error) {
      console.log("Error connecting wifi => ", error);

      reject(error);
    }
  });
};

type PrinterLanguageCode = 0 | 1 | 2 | 3;
type ScriptContext = Record<string, any>;

const SPEED_COMMANDS: Record<string, string> = {
  "1": "VARIABLE LOWSPEED",
  "2": "VARIABLE NORMALSPEED",
  "3": "VARIABLE HIGHSPEED",
};

function resolveVariables(ctx: ScriptContext): string[] {
  const lines: string[] = [];

  if ("darkness" in ctx) lines.push(`VARIABLE DARKNESS ${ctx.darkness * 10}`);
  if ("speedValue" in ctx) lines.push(SPEED_COMMANDS[ctx.speedValue] || "");
  if ("shiftLeft" in ctx) lines.push(`VARIABLE SHIFT LEFT ${ctx.shiftLeft}`);
  if ("printWidth" in ctx) lines.push(`VARIABLE WIDTH ${ctx.printWidth}`);
  if ("topOfForm" in ctx) lines.push(`VARIABLE TOF ${ctx.topOfForm}`);

  return lines.filter(Boolean);
}

const SCRIPT_TEMPLATES: Record<number, string> = {
  0: `
TEXT 1(0,0,0,0) 15 15 Cognitive Programming Language
TEXT 0(0,0,0,0) 125 55 CPL Sample Label
DRAW_BOX 0 0 390 390 2
BARCODE UPCA+ 150 245 100 19112610203
TEXT 0(0,180,0,0) 275 320 CPL Sample Label
TEXT 1(0,180,0,0) 375 350 Cognitive Programming Language
END`,

  1: `
END
N
q609
Q250,15
A50,50,0,4,1,1,N,"EPL Sample Label"
A50,100,0,4,1,1,N,"Product: sample product"
A50,150,0,4,1,1,N,"Price: $19.99"
A50,200,0,4,1,1,N,"Qty: 10"
P1`,

  2: `
END
^XA
^FO65,15^A0N,45,36^FDZPL Sample Label^FS
^FO100,135
^BUN,100,Y,N,N
^FD12345678901^FS
^FO70,330^A0I,45,36^FDZPL Sample Label^FS
^FO0,0
^GB390,390,2,B,0
^XZ`,

  3: "", // fallback to CPL
};

export function generateTestLabelScript(
  languageCode: PrinterLanguageCode,
  context: ScriptContext
): string {
  const header = "! 0 100 390 1";
  const variableLines = resolveVariables(context).join("\n");
  const body = SCRIPT_TEMPLATES[languageCode] || SCRIPT_TEMPLATES[0];
  return [header, variableLines, body].join("\n").trim();
}
