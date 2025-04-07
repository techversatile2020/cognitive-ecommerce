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
    new Promise<void>((resolve) => {
      const subscription = this.manager.onStateChange((state) => {
        switch (state) {
          case BluetoothState.Unsupported:
            this.showErrorToast("");
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            this.manager.enable().catch((error: BleError) => {
              if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
                this.requestBluetoothPermission();
              }
            });
            break;
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            resolve();
            subscription.remove();
            break;
          default:
            console.error("Unsupported state: ", state);
          // resolve()
          // subscription.remove()
        }
      }, true);
    });

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
        console.error(error.message);
        this.manager.stopDeviceScan();
        throw new Error(error?.message);
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
          resolve(device);
        })
        .catch((error) => {
          if (
            error.errorCode === BleErrorCode.DeviceAlreadyConnected &&
            this.device
          ) {
            resolve(this.device);
          } else {
            this.onError(error);
            console.log("ERROR 154");
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
    time: Base64
  ) => {
    if (!this.device) {
      this.showErrorToast(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithResponseForDevice(
        this.device.id,
        serviceUUID,
        characteristicUUID,
        time
      )
      .catch((error) => {
        this.onError(error);
      });
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
    return this.manager.monitorCharacteristicForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      listener
    );
  };

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

  connectAndSendWifi = async (ssid: string, password: string) => {
    try {
      // const device = await bleManager.connectToDevice(deviceId);
      const device = this.device;
      const manager = this.manager;
      // 1. Enable notifications FIRST
      await manager?.startCharacteristicNotificationsForDevice(
        this.device.id,
        WIFI_SERVICE_UUID,
        DATA_OUT_CHAR_UUID
      );

      // 2. Setup monitor
      this.setupMonitor(
        WIFI_SERVICE_UUID,
        DATA_OUT_CHAR_UUID,
        (characteristic) => {
          if (!characteristic.value) {
            console.log("Empty value received");
            return;
          }
          const raw = Buffer.from(characteristic.value, "base64");
          console.log("Raw data (hex):", raw.toString("hex")); // Debug raw bytes
          console.log("Status:", raw.toString("utf8"));
        },
        (error) => console.error("Monitor error:", error)
      );
      await manager.discoverAllServicesAndCharacteristicsForDevice(device?.id);
      await device.characteristicsForService(WIFI_SERVICE_UUID);

      if (!this.device || !(await this.manager.isDeviceConnected(device.id))) {
        this.device = await this.manager.connectToDevice(device.id);
        await this.manager.discoverAllServicesAndCharacteristicsForDevice(
          device.id
        );
      }

      // Write to Control Point

      // try {
      //   const transactionId = "wifi-monitor-" + Date.now(); // or uuid()

      //   // Listen for response (optional)
      //   device.monitorCharacteristicForService(
      //     WIFI_SERVICE_UUID,
      //     "14387803-130c-49e7-b877-2881c89cb258",
      //     (error, characteristic) => {
      //       if (error) {
      //         console.error("Notification error:", error.message);
      //         return;
      //       }
      //       const data = Buffer.from(
      //         characteristic?.value ?? "",
      //         "base64"
      //       ).toString("utf8");
      //       console.log("Response from nRF7002: ", data);
      //     },
      //     transactionId
      //   );
      // } catch (err) {
      //   console.log("Notificaiton error ", err);
      // }

      const payload = JSON.stringify({ ssid: ssid, password: password });
      const encoded = Buffer.from(payload, "utf8").toString("base64");

      await this.writeCharacteristicWithResponseForDevice(
        WIFI_SERVICE_UUID,
        CONTROL_POINT_CHAR_UUID,
        encoded
      );
    } catch (error) {
      console.error("Provisioning error: ", error.message);
      throw error;
    }
  };

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
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error,
    });
    console.error(error);
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
