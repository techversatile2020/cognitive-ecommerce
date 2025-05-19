import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrinterDetails } from "../../../services/printerServices";
import { setPrinterDetailsByIp } from "../../../redux/reducers";
import { toast } from "../../../utils/toast.utils";
import { store } from "../../../redux";

export const usePrinter = (ip, initialVar = null, interval: number|false = 5000) => {
  const dispatch = useDispatch();
  const { printerDetailsByIp } = useSelector((state: any) => state.printer);
  return useQuery({
    queryKey: ["printer-status", ip],
    queryFn: async () => {
      if (!ip) throw new Error("IP not set");
      console.log(`Connecting to ${ip}...`);

      try {
        const result = await fetchPrinterDetails(ip, initialVar);
        console.log("result => ", result);

        dispatch(setPrinterDetailsByIp({ ip, details: result }));
        return result;
      } catch (error) {
        console.log("ERROR => ", error);

        if (printerDetailsByIp[ip]) {
          dispatch(
            setPrinterDetailsByIp({
              ip,
              details: {
                Status: "Disconnected",
                statusCategory: "Disconnected",
                IP_Addr: ip,
              },
            })
          );
        }
        throw new Error(error);
      }
    },
    enabled: !!ip,
    refetchInterval: interval,
    retry: false,
  });
};
