import {
  BleError,
  BleErrorCode,
  BleManager,
  Device,
  State as BluetoothState,
  LogLevel,
  type DeviceId,
  type TransactionId,
  type UUID,
  type Characteristic,
  type Base64,
  type Subscription,
} from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Buffer } from "buffer";
import * as Request from "./../../protos/request_pb";
import * as Common from "./../../protos/common_pb";
import * as Response from "./../../protos/response_pb";
import { CHARACTERISTIC_UUID, SERVICE_UUID } from "../../src/utils/UUIDS";
import { rejects } from "assert";
import { setCurrentConnectedPrinter } from "../../src/redux/reducers";
import { useDispatch } from "react-redux";
import { store } from "../../src/redux";

// import {
//   WifiInfo,
//   DeviceStatus,
//   ConnectionFailureReason,
//   ConnectionState,
//   Status,
//   WifiConfig,
//   ConnectionInfo,
// } from "./../../protos/response_pb";
// import * as Result from "./../../protos/result_pb";
// import * as Version from "./../../protos/version_pb";

const deviceNotConnectedErrorText = "Device is not connected";
const WIFI_SERVICE_UUID = "14387800-130c-49e7-b877-2881c89cb258";
const CONTROL_POINT_CHAR_UUID = "14387802-130c-49e7-b877-2881c89cb258";
const DATA_OUT_CHAR_UUID = "14387803-130c-49e7-b877-2881c89cb258";

class BLEServiceInstance {
  manager: BleManager;
  private discoveredDevices: Map<string, Device> = new Map();
  device: Device | null;

  characteristicMonitor: Subscription | null;

  isCharacteristicMonitorDisconnectExpected = false;

  constructor() {
    this.device = null;
    this.characteristicMonitor = null;
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
  }

  createNewManager = () => {
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
  };

  getDevice = () => this.device;

  initializeBLE = () =>
    new Promise((resolve, reject) => {
      const subscription = this.manager.onStateChange(async (state) => {
        try {
          switch (state) {
            case BluetoothState.Unsupported:
              this.showErrorToast("Bluetooth not supported on this device.");
              subscription.remove();
              return reject(new Error("Bluetooth unsupported"));

            case BluetoothState.PoweredOff:
              this.showErrorToast("Bluetooth is off. Please enable it.");
              this.onBluetoothPowerOff();

              try {
                await this.manager.enable(); // for Android
              } catch (error: any) {
                if (error?.errorCode === BleErrorCode.BluetoothUnauthorized) {
                  await this.handleBluetoothUnauthorized(reject);
                } else {
                  this.showErrorToast("Failed to enable Bluetooth");
                  return reject(error);
                }
              }
              break;

            case BluetoothState.Unauthorized:
              await this.handleBluetoothUnauthorized(reject);
              break;

            case BluetoothState.PoweredOn:
              subscription.remove();
              return resolve("Bluetooth Ready");

            default:
              this.showErrorToast("Unhandled Bluetooth state");
              subscription.remove();
              return reject(new Error(`Unhandled Bluetooth state: ${state}`));
          }
        } catch (err) {
          subscription.remove();
          reject(err);
        }
      }, true);
    });

  handleBluetoothUnauthorized = async (reject: (err: any) => void) => {
    try {
      await this.requestBluetoothPermission();
      this.showErrorToast("Bluetooth permission granted. Please retry.");
      reject(
        new Error("Bluetooth permission was unauthorized but is now requested.")
      );
    } catch {
      this.showErrorToast("Bluetooth permission denied.");
      reject(new Error("Bluetooth permission denied by user."));
    }
  };

  disconnectDevice = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);

      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .cancelDeviceConnection(this.device.id)
      .then(() => this.showSuccessToast("Device disconnected"))
      .catch((error) => {
        if (error?.code !== BleErrorCode.DeviceDisconnected) {
          this.onError(error);
        }
      });
  };

  disconnectDeviceById = (id: DeviceId) =>
    this.manager
      .cancelDeviceConnection(id)
      .then(() => this.showSuccessToast("Device disconnected"))
      .catch((error) => {
        if (error?.code !== BleErrorCode.DeviceDisconnected) {
          this.onError(error);
          throw new Error(error);
        }
      });

  onBluetoothPowerOff = () => {
    this.showErrorToast("Bluetooth is turned off");
  };

  scanDevices = async (
    onDeviceFound: (deviceList: Device[]) => void,
    UUIDs: UUID[] | null = null,
    legacyScan?: boolean
  ) => {
    this.discoveredDevices.clear();

    this.manager.startDeviceScan(UUIDs, { legacyScan }, (error, device) => {
      if (error) {
        this.onError(error);
        // console.error(error.message);
        this.manager.stopDeviceScan();
        return error?.message;
        // throw new Error(error?.message);
      }
      if (device) {
        // onDeviceFound(Array.from(this.discoveredDevices.values()));

        if (
          device &&
          !this.discoveredDevices.has(device.id) &&
          device.isConnectable
        ) {
          this.discoveredDevices.set(device.id, device);
          const deviceArray = Array.from(this.discoveredDevices.values());
          onDeviceFound(deviceArray); // emit full updated list
        }
      }
    });
  };

  stopScan = async () => {
    this.manager.stopDeviceScan();
  };

  connectToDevice = (deviceId: DeviceId) =>
    new Promise<Device>((resolve, reject) => {
      this.manager.stopDeviceScan();
      this.manager
        .connectToDevice(deviceId)
        .then((device) => {
          this.device = device;
          this.onDeviceDisconnected((error, device) => {
            store.dispatch(setCurrentConnectedPrinter(null));
            if (error) {
              // this.showErrorToast(error?.message);
              reject(error);
            }
          });

          resolve(device);
        })
        .catch((error) => {
          if (
            error.errorCode === BleErrorCode.DeviceAlreadyConnected &&
            this.device
          ) {
            resolve(this.device);
          } else {
            // this.onError(error);
            reject(error);
          }
        });
    });

  discoverAllServicesAndCharacteristicsForDevice = async () =>
    new Promise<Device>((resolve, reject) => {
      if (!this.device) {
        this.showErrorToast(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
      }
      this.manager
        .discoverAllServicesAndCharacteristicsForDevice(this.device.id)
        .then((device) => {
          resolve(device);
          this.device = device;
        })
        .catch((error) => {
          this.onError(error);
          reject(error);
        });
    });

  readCharacteristicForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID
  ) =>
    new Promise<Characteristic>((resolve, reject) => {
      if (!this.device) {
        this.showErrorToast(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
      }
      this.manager
        .readCharacteristicForDevice(
          this.device.id,
          serviceUUID,
          characteristicUUID
        )
        .then((characteristic) => {
          resolve(characteristic);
        })
        .catch((error) => {
          this.onError(error);
        });
    });

  writeCharacteristicWithResponseForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    base64Value: Base64
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    return this.manager.writeCharacteristicWithResponseForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      base64Value
    );
  };

  writeCharacteristicWithoutResponseForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    time: Base64
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithoutResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        time
      )
      .catch((error) => {
        this.onError(error);
      });
  };

  setupMonitor = (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    onCharacteristicReceived: (characteristic: Characteristic) => void,
    onError: (error: Error) => void,
    transactionId?: TransactionId,
    hideErrorDisplay?: boolean
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
      this.device?.id,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (
            error.errorCode === 2 &&
            this.isCharacteristicMonitorDisconnectExpected
          ) {
            this.isCharacteristicMonitorDisconnectExpected = false;
            return;
          }
          onError(error);
          if (!hideErrorDisplay) {
            this.onError(error);
            this.characteristicMonitor?.remove();
          }
          return;
        }
        if (characteristic) {
          onCharacteristicReceived(characteristic);
        }
      },
      transactionId
    );
  };

  setupCustomMonitor: BleManager["monitorCharacteristicForDevice"] = (
    ...args
  ) => this.manager.monitorCharacteristicForDevice(...args);

  finishMonitor = () => {
    this.isCharacteristicMonitorDisconnectExpected = true;
    this.characteristicMonitor?.remove();
  };

  turnOnLED = async () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    try {
      const base64Value = Buffer.from([0x01]).toString("base64"); // Assuming 0x01 turns the LED on

      await this.manager.writeCharacteristicWithoutResponseForDevice(
        this.device.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Value
      );
      console.log("TRUNED ON");

      this.showSuccessToast("Turned LED ON");
    } catch (error) {
      this.onError(error as BleError);
      console.error("Error turning LED ON:", error);
    }
  };

  writeDescriptorForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    descriptorUUID: UUID,
    data: Base64
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeDescriptorForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        descriptorUUID,
        data
      )
      .catch((error) => {
        this.onError(error);
      });
  };

  readDescriptorForDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    descriptorUUID: UUID
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .readDescriptorForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        descriptorUUID
      )
      .catch((error) => {
        this.onError(error);
      });
  };

  monitorCharacteristicForService = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    listener: (
      error: BleError | null,
      characteristic: Characteristic | null
    ) => void
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      listener
    );
    return;
  };
  monitorCharacteristicForServiceDevice = async (
    serviceUUID: UUID,
    characteristicUUID: UUID,
    listener: (
      error: BleError | null,
      characteristic: Characteristic | null
    ) => void
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    return this.manager.monitorCharacteristicForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      listener
    );
  };
  // Modify requestMTUForDevice to handle iOS better
  async requestMTUForDevice_(mtu: number) {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    try {
      const result = await this.manager.requestMTUForDevice(
        this.device.id,
        mtu
      );

      // iOS workaround: Sometimes needs multiple attempts
      if (Platform.OS === "ios" && result.mtu < mtu) {
        return await this.manager.requestMTUForDevice(this.device.id, mtu);
      }

      return result;
    } catch (error) {
      console.error("MTU request failed:", error);
      throw error;
    }
  }
  async writeDescriptorForCharacteristic(
    serviceUUID: UUID,
    characteristicUUID: UUID,
    descriptorUUID: UUID,
    value: Base64
  ) {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    return this.manager.writeDescriptorForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      descriptorUUID,
      value
    );
  }

  // Add this new method to handle iOS-specific CCCD configuration
  async enableNotificationsIOS(
    serviceUUID: UUID,
    characteristicUUID: UUID,
    listener
  ) {
    // Check if characteristic is notifiable or indicatable before monitoring
    const char = await this.device.readCharacteristicForService(
      serviceUUID,
      characteristicUUID
    );

    if (char.isNotifiable || char.isIndicatable) {
      // Monitor the characteristic for notifications or indications
      await this.device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        listener // Pass the listener to handle data updates
      );
      console.log(`Notifications enabled for ${characteristicUUID}`);
    } else {
      console.warn("Characteristic is not notifiable or indicatable");
    }
  }

  getServicesForDevice = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.servicesForDevice(this.device.id).catch((error) => {
      this.onError(error);
    });
  };

  getCharacteristicsForDevice = (serviceUUID: UUID) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .characteristicsForDevice(this.device.id, serviceUUID)
      .catch((error) => {
        this.onError(error);
      });
  };

  getDescriptorsForDevice = (serviceUUID: UUID, characteristicUUID: UUID) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .descriptorsForDevice(this.device.id, serviceUUID, characteristicUUID)
      .catch((error) => {
        this.onError(error);
      });
  };

  isDeviceConnected = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.isDeviceConnected(this.device.id);
  };

  isDeviceWithIdConnected = (id: DeviceId) =>
    this.manager.isDeviceConnected(id).catch(console.error);

  getConnectedDevices = (expectedServices: UUID[]) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.connectedDevices(expectedServices).catch((error) => {
      this.onError(error);
    });
  };

  requestMTUForDevice = (mtu: number) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .requestMTUForDevice(this.device.id, mtu)
      .catch((error) => {
        this.onError(error);
      });
  };

  onDeviceDisconnected = (
    listener: (error: BleError | null, device: Device | null) => void
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    // dispatch(setCurrentConnectedPrinter(null));
    return this.manager.onDeviceDisconnected(this.device.id, listener);
  };

  onDeviceDisconnectedCustom: BleManager["onDeviceDisconnected"] = (...args) =>
    this.manager.onDeviceDisconnected(...args);

  readRSSIForDevice = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }

    return this.manager.readRSSIForDevice(this.device.id).catch((error) => {
      this.onError(error);
    });
  };

  getDevices = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.devices([this.device.id]).catch((error) => {
      this.onError(error);
    });
  };

  cancelTransaction = (transactionId: TransactionId) =>
    this.manager.cancelTransaction(transactionId);

  enable = () =>
    this.manager.enable().catch((error) => {
      this.onError(error);
    });

  disable = () =>
    this.manager.disable().catch((error) => {
      this.onError(error);
    });

  getState = () =>
    this.manager.state().catch((error) => {
      this.onError(error);
    });

  onError = (error: BleError) => {
    switch (error.errorCode) {
      case BleErrorCode.BluetoothUnauthorized:
        this.requestBluetoothPermission();
        break;
      case BleErrorCode.LocationServicesDisabled:
        this.showErrorToast("Location services are disabled");
        break;
      default:
        this.showErrorToast(JSON.stringify(error, null, 4));
    }
  };

  requestConnectionPriorityForDevice = (priority: 0 | 1 | 2) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.requestConnectionPriorityForDevice(
      this.device?.id,
      priority
    );
  };

  cancelDeviceConnection = () => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    this.manager.cancelDeviceConnection(this.device?.id);
    return (this.device = null);
  };

  // async connectAndSendWifi(ssid: string, password: string) {
  //   // const response = Response.deserializeBinary(binary);

  //   if (!this.device) {
  //     this.showErrorToast("No device found. Please scan and connect first.");
  //     return;
  //   }
  //   try {
  //     // Step 1: Use custom method to check if connected
  //     const isConnected = await this.manager.isDeviceConnected(this.device.id);
  //     if (!isConnected) {
  //       this.showErrorToast("Device disconnected. Reconnecting...");
  //       // Step 2: Reconnect using existing methods
  //       this.device = await this.connectToDevice(this.device.id);
  //       await this.discoverAllServicesAndCharacteristicsForDevice();
  //     }
  //   } catch (err) {
  //     this.showErrorToast("Reconnection failed: " + (err as Error).message);
  //     return;
  //   }

  //   let Wifi = new Common.WifiInfo();
  //   const RequestWifi = new Request.WifiConfig();
  //   Wifi.setSsid(ssid);
  //   RequestWifi.setWifi(Wifi);
  //   RequestWifi.setPassphrase(password);

  //   // request.setType(1);
  //   const request = new Request.Request();
  //   const payload = request.serializeBinary();
  //   const base64Payload = Buffer.from(payload).toString("base64");

  //   this.manager.monitorCharacteristicForDevice(
  //     this.device?.id,
  //     WIFI_SERVICE_UUID,
  //     CONTROL_POINT_CHAR_UUID,
  //     (error, characteristic) => {
  //       console.log("EVENT RUNNING...");

  //       if (error) {
  //         console.error("🚨 Error monitoring response:", error);
  //         return;
  //       }

  //       const base64Value = characteristic.value;
  //       console.log("base64Value ", base64Value);

  //       const buffer = Buffer.from(base64Value, "base64");
  //       console.log("📦 Buffer length:", buffer.length);
  //       console.log("🧬 Hex preview:", buffer.toString("hex").slice(0, 50));
  //       console.log("🧬 Full Hex:", buffer.toString("hex"));

  //       try {
  //         // const res = Response.Response();
  //         // console.log(Object.keys(res));
  //         console.log("555");

  //         const response = Response.Response.deserializeBinary(buffer);
  //         console.log("558");
  //         // console.log("🔍 State from object:", response.toObject().state);
  //         console.log("Response from ble => ", response.toObject());
  //       } catch (err) {
  //         console.error("❌ Failed to decode response:", err);
  //       }
  //     }
  //   );
  //   await this.device
  //     .writeCharacteristicWithResponseForService(
  //       WIFI_SERVICE_UUID,
  //       CONTROL_POINT_CHAR_UUID,
  //       base64Payload
  //     )
  //     .then((res) => {
  //       console.log("WiFi credentials sent successfully", res);
  //     })
  //     .catch((err) => {
  //       console.log("ERROR WRITTING => ", err);
  //     });
  // }

  requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (Platform.OS === "android") {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (
        apiLevel < 31 &&
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.showErrorToast("Permission have not been granted");

    return false;
  };

  showErrorToast = (error: string) => {
    return Toast.show({
      type: "error",
      text1: "Error",
      text2: error,
    });
  };

  showSuccessToast = (info: string) => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: info,
    });
  };
}

export const BLEService = new BLEServiceInstance();
