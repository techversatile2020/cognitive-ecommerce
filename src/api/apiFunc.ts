import axios from "axios";

// Extract value from the CGI response like: var Status=5;
export const extractValue = (text, key) => {
  const regex = new RegExp(`${key}="?([0-9a-zA-Z_]+)"?;`);
  const match = text.match(regex);
  return match ? match[1] : null;
};

const extractVarValue = (text: string, key: string): string => {
  const regex = new RegExp(`var ${key}=([^;]+);`);
  const match = text.match(regex);
  if (!match) return "";
  const rawValue = match[1];
  return rawValue.startsWith('"') ? rawValue.replace(/"/g, "") : rawValue;
};

// Call to check printer's status and connection
export const getPrinterStatus = async (ip4Addr) => {
  try {
    const variables = [
      "LanguageV",
      "HostName",
      "ModelNum",
      "Status",
      "IP_Address",
      "SerialNumber",
      "FirmwareVersion",
      "WiFiFwVersion",
      "SSID",
      "RSSI",
      "Darkness",
      "SpeedV",
      "IndexV",
      "MediaTypeV",
      "PrintWidth",
      "ShiftLeft",
      "IPConfig",
      "NetMask",
      "GatewayIP",
      "TOFAdj",
    ];
    const query = variables.join(";");

    const response = await fetch(
      `http://${ip4Addr}/cgi-bin/buildprintervarvalues.cgi?${query}`
    );
    const text = await response.text();
    const result = {};

    // const data = response.data;
    for (const key of variables) {
      const value = extractVarValue(text, key);
      result[key] = key === "RSSI" ? getRssiString(Number(value)) : value;
    }
    console.log("Resputl => ", result);

    return result;
  } catch (error) {
    return {
      connected: false,
      status: null,
      error: error,
    };
  }
};

export const getPrinterStatusInfo = (statusCode) => {
  const STATUS_MAP = {
    0: { label: "Ready", category: "OK", color: "green" },
    1: { label: "Printhead Hot", category: "ERROR", color: "red" },
    2: { label: "Printhead Up", category: "WARNING", color: "yellow" },
    3: { label: "Motor Hot", category: "ERROR", color: "red" },
    4: { label: "Parse Error", category: "WARNING", color: "yellow" },
    5: { label: "Offline", category: "WARNING", color: "gray" },
    6: { label: "Paper Out", category: "ERROR", color: "red" },
    7: { label: "Ribbon Out", category: "ERROR", color: "red" },
    8: { label: "Programming Flash", category: "OK", color: "green" },
    9: { label: "Halted", category: "OK", color: "green" },
    10: { label: "Hex Dump Mode", category: "OK", color: "green" },
    11: { label: "USB MSD Reading", category: "OK", color: "green" },
    12: { label: "Invalid Paper", category: "ERROR", color: "red" },
    13: { label: "Printing", category: "OK", color: "green" },
    14: { label: "Calibrate Succeeded", category: "OK", color: "green" },
    15: { label: "Calibrating", category: "WARNING", color: "yellow" },
    16: { label: "Calibrate Failed", category: "WARNING", color: "yellow" },
  };

  return (
    STATUS_MAP[statusCode] || {
      label: "Unknown",
      category: "UNKNOWN",
      color: "gray",
    }
  );
};

// utils/printerApi.ts

export const fetchPrinterVars = async (ip: string, variables: string[]) => {
  try {
    // Build the query string from the variables array
    const queryString = variables.join(";");
    const res = await fetch(
      `http://${ip}/cgi-bin/buildprintervarvalues.cgi?${queryString}`
    );

    const text = await res.text();

    // Loop through the variables and fetch the corresponding values
    const result = {};
    for (const key of variables) {
      let value = getVarValue(text, key);

      // If the key is "RSSI", convert the number to a string
      if (key === "RSSI" && value !== "") {
        value = getRssiString(parseInt(value, 10));
      }

      result[key] = value;
    }

    return result;
  } catch (err) {
    console.error("fetchPrinterVars error:", err);
    return null;
  }
};

const getVarValue = (text: string, key: string): string => {
  const regex = new RegExp(`var ${key}=([^;]+);`);
  const match = text.match(regex);
  if (!match) return "";
  const raw = match[1];
  if (raw.startsWith('"')) return raw.replace(/"/g, "");
  return raw;
};

// Convert RSSI value to a string based on the specified ranges
const getRssiString = (rssi: number): string => {
  if (rssi >= -30 && rssi <= 0) return "Excellent";
  if (rssi > -50 && rssi < -30) return "Strong";
  if (rssi > -70 && rssi <= -50) return "Good";
  if (rssi > -80 && rssi <= -70) return "Weak";
  if (rssi > -90 && rssi <= -80) return "Poor";
  return "Unstable";
};
