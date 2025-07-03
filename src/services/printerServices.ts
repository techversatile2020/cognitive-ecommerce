export const fetchPrinterDetails = async (
  ip: string,
  initialVar?: string[] | null
) => {
  try {
    const variables = initialVar || [
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

    const response = await axios.get(
      `http://${ip}/cgi-bin/buildprintervarvalues.cgi?${query}`,
      {
        timeout: 5000,
      }
    );
    const text = await response.data;

    const result = {};

    for (const key of variables) {
      const value = extractVarValue(text, key);
      if (key === "RSSI") {
        result[key] = getRssiString(Number(value));
      } else if (key === "Status") {
        result[key] = getPrinterStatusDetails(Number(value)).label;
        result["statusCategory"] = getPrinterStatusDetails(
          Number(value)
        ).category;
      } else {
        result[key] = value;
      }
    }

    return result;
  } catch (e) {
    throw new Error(e);
  }
};
const getRssiString = (rssi: number): string => {
  if (rssi >= -30 && rssi <= 0) return "Excellent";
  if (rssi > -50 && rssi < -30) return "Strong";
  if (rssi > -70 && rssi <= -50) return "Good";
  if (rssi > -80 && rssi <= -70) return "Weak";
  if (rssi > -90 && rssi <= -80) return "Poor";
  return "Unstable";
};

const extractVarValue = (text: string, key: string): string => {
  const regex = new RegExp(`var ${key}=([^;]+);`);
  const match = text.match(regex);
  if (!match) return "";
  const rawValue = match[1];
  return rawValue.startsWith('"') ? rawValue.replace(/"/g, "") : rawValue;
};

type PrinterStatusCategory = "OK" | "WARNING" | "ERROR" | "UNKNOWN";

type PrinterStatusDetails = {
  code: number;
  label: string;
  category: PrinterStatusCategory;
  color: string;
};

export const getPrinterStatusDetails = (code: number): PrinterStatusDetails => {
  const statusMap: {
    [key: number]: { label: string; category: PrinterStatusCategory };
  } = {
    0: { label: "Ready", category: "OK" },
    1: { label: "Printhead Hot", category: "ERROR" },
    2: { label: "Printhead Up", category: "WARNING" },
    3: { label: "Motor Hot", category: "ERROR" },
    4: { label: "Parse Error", category: "WARNING" },
    5: { label: "Offline", category: "WARNING" },
    6: { label: "Paper Out", category: "ERROR" },
    7: { label: "Ribbon Out", category: "ERROR" },
    8: { label: "Programming Flash", category: "OK" },
    9: { label: "Halted", category: "OK" },
    10: { label: "Hex Dump Mode", category: "OK" },
    11: { label: "USB MSD Reading", category: "OK" },
    12: { label: "Invalid Paper", category: "ERROR" },
    13: { label: "Printing", category: "OK" },
    14: { label: "Calibrate Succeeded", category: "OK" },
    15: { label: "Calibrating", category: "WARNING" },
    16: { label: "Calibrate Failed", category: "WARNING" },
  };

  const defaultStatus = {
    label: "Unknown",
    category: "UNKNOWN" as PrinterStatusCategory,
  };
  const status = statusMap[code] || defaultStatus;

  const colorMap: { [key in PrinterStatusCategory]: string } = {
    OK: "green",
    WARNING: "yellow",
    ERROR: "red",
    UNKNOWN: "gray",
  };

  return {
    code,
    label: status.label,
    category: status.category,
    color: colorMap[status.category],
  };
};

import axios, { AxiosRequestConfig, Method } from "axios";
import { toast } from "../utils/toast.utils";

interface RequestParams {
  ip: string;
  endpoint: string;
  method?: Method;
  data?: any;
  headers?: any;
  timeout?: number;
  responseType?: AxiosRequestConfig["responseType"];
}

export const sendRequest = async ({
  ip,
  endpoint,
  method = "GET",
  data = null,
  timeout = 8000,
  responseType = "text", // for factory reset HTML response
  headers,
}: RequestParams): Promise<any> => {
  const finalHeaders =
    headers && typeof headers === "object"
      ? headers
      : { "Content-Type": "application/x-www-form-urlencoded" };
  let url = `http://${ip}/cgi-bin/${endpoint}`;

  try {
    const response = await axios({
      url,
      method,
      data,
      headers: finalHeaders,
      timeout,
      responseType,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Request failed: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      if (error?.message == "Network Error") {
        toast.fail("Failed", "Connection lost to device!");
      }
      throw new Error("No response received from server.");
    }

    throw new Error(error);
  }
};
