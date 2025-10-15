import { combineReducers } from "redux";
import printerReducer, {
  setError,
  setLoading,
  setScannedWifis,
  setSelectedPrinter,
  setSuccess,
  addConnectedPrinter,
  addScannedWifi,
  setCurrentConnectedPrinter,
  setPrinterDetailsByIp,
  removePrinterByIp,
} from "./printer.slice";

import authReducer from "./auth.slice";

export const rootReducer = combineReducers({
  printer: printerReducer,
  auth: authReducer,
});

export {
  setError,
  setLoading,
  setScannedWifis,
  setSelectedPrinter,
  setSuccess,
  addConnectedPrinter,
  addScannedWifi,
  printerReducer,
  setCurrentConnectedPrinter,
  setPrinterDetailsByIp,
  removePrinterByIp,
};
