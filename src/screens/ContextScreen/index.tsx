// WifiScannedDevicesContext.js

import React, { createContext, useContext, useState } from "react";

export const WifiContext: any = createContext({});

export const WifiScannedDevicesProvider = ({ children }) => {
  const [wifiScannedDevices, setWifiScannedDevices] = useState([]);
  const [connectedPrinters, setConnectedPrinters] = useState([]);
  const [selectedPrinters, setSelectedPrinter] = useState(null);

  return (
    <WifiContext.Provider
      value={{
        wifiScannedDevices,
        setWifiScannedDevices,
        connectedPrinters,
        setConnectedPrinters,
        selectedPrinters,
        setSelectedPrinter,
      }}
    >
      {children}
    </WifiContext.Provider>
  );
};
