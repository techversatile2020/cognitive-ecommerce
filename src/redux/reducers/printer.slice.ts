import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { converBase64Obj } from "../../utils/ble.util";

export type PrinterStateType = {
  connectedPrinters: any[];
  scannedWifis: any[];
  selectedPrinter: any | null;
  error: null | any;
  success: null | any;
  loading: null | any;
  currentConnectedPrinter: any | null;
  printerDetailsByIp: string | any;
};

const initialState: PrinterStateType = {
  connectedPrinters: [],
  scannedWifis: [],
  selectedPrinter: null,
  error: null,
  success: false,
  loading: null,
  currentConnectedPrinter: null,
  printerDetailsByIp: {},
};

const printerSlice = createSlice({
  name: "printer",
  initialState,
  reducers: {
    setScannedWifis: (state, action: PayloadAction<any[]>) => {
      state.scannedWifis = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    addConnectedPrinter: (state, action: PayloadAction<any>) => {
      const { deviceStatus } = converBase64Obj(action.payload);
      const { connectionInfo } = deviceStatus;
      const { ip4Addr } = connectionInfo;
      // state.connectedPrinters.push(action.payload);

      // Check if the printer with the same id already exists in the array
      const isPrinterExists = state.connectedPrinters.findIndex((printer) => {
        let { deviceStatus } = converBase64Obj(printer);
        return deviceStatus.connectionInfo.ip4Addr === ip4Addr;
      });

      // Only add if it doesn't exist
      if (!isPrinterExists) {
        state.connectedPrinters.push(action.payload);
      } else {
        state.connectedPrinters[isPrinterExists] = action.payload;
      }
    },
    addScannedWifi: (state, action: PayloadAction<any>) => {
      state.scannedWifis.push(action.payload);
    },
    removeConnectedPrinter: (state, action: PayloadAction<string>) => {
      state.connectedPrinters = state.connectedPrinters.filter(
        (printer) => printer.id !== action.payload
      );
    },
    setPrinterDetailsByIp: (
      state,
      action: PayloadAction<{ ip: string; details: any }>
    ) => {
      const { ip, details } = action.payload;
      state.printerDetailsByIp[ip] = {
        ...state.printerDetailsByIp[ip],
        ...details,
      };
    },

    setSelectedPrinter: (state, action: PayloadAction<any>) => {
      state.selectedPrinter = action.payload;
    },
    clearPrinters: (state) => {
      state.connectedPrinters = [];
      state.selectedPrinter = null;
    },
    setCurrentConnectedPrinter: (state, action) => {
      state.currentConnectedPrinter = action.payload;
    },
    removePrinterByIp: (state, action: PayloadAction<string>) => {
      const ip = action.payload;
      if (state.printerDetailsByIp && state.printerDetailsByIp[ip]) {
        delete state.printerDetailsByIp[ip];
      }
    },
  },
});

export const {
  setScannedWifis,
  addConnectedPrinter,
  removeConnectedPrinter,
  setSelectedPrinter,
  clearPrinters,
  setLoading,
  setError,
  setSuccess,
  addScannedWifi,
  setCurrentConnectedPrinter,
  setPrinterDetailsByIp,
  removePrinterByIp,
} = printerSlice.actions;

export default printerSlice.reducer;
