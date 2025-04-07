import { Platform, PermissionsAndroid, Linking } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { NetworkInfo } from "react-native-network-info";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

class WiFiService {
  async requestPermissions() {
    if (Platform.OS === "ios") {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
        PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
      ]);
      return (
        granted["android.permission.ACCESS_FINE_LOCATION"] === "granted" &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] === "granted"
      );
    }
    return true; // iOS handles permissions via capabilities
  }

  async scanWiFiNetworks(onNetworksFound: (networks: any[]) => void) {
    const permissionGranted = await this.requestPermissions();
    if (Platform.OS === "android") {
      try {
        if (!permissionGranted) {
          throw new Error("Location permission not granted");
        }

        const wifiList = await WifiManager.loadWifiList();
        onNetworksFound(wifiList);
      } catch (error) {
        console.error("Failed to scan WiFi networks:", error);
        onNetworksFound([]);
      }
    } else {
      // iOS does not support scanning. Show only currently connected SSID
      try {
        const ssid = await NetworkInfo.getSSID();
        if (ssid && ssid !== "unknown") {
          onNetworksFound([{ SSID: ssid, BSSID: "", level: null }]);
        } else {
          onNetworksFound([]);
        }
      } catch (error) {
        console.error("Failed to get SSID:", error);
        onNetworksFound([]);
      }
    }
  }

  async connectToWiFi(ssid: string, password: string) {
    if (Platform.OS === "android") {
      try {
        await WifiManager.connectToProtectedSSID(ssid, password, false, false);
        return true;
      } catch (error) {
        console.error("Failed to connect to WiFi:", error);
        throw error;
      }
    } else {
      // iOS does not support direct connection
      Linking.openURL("App-Prefs:WIFI");
      throw new Error("Please connect manually in Wi-Fi settings on iOS");
    }
  }

  async getCurrentSSID() {
    try {
      const granted = await this.requestPermissions();
      if (!granted) return null;
      const ssid = await NetworkInfo.getSSID();
      return ssid;
    } catch (error) {
      console.error("Failed to get current SSID:", error);
      return null;
    }
  }
}

export const wifiService = new WiFiService();
