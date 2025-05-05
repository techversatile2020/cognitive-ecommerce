import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrinterDetails } from "../../../services/printerServices";
import { setPrinterDetailsByIp } from "../../../redux/reducers";
import { toast } from "../../../utils/toast.utils";

export const usePrinter = (ip, initialVar = null) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["printer-status", ip],
    queryFn: async () => {
      if (!ip) throw new Error("IP not set");
      try {
        const result = await fetchPrinterDetails(ip, initialVar);
        dispatch(setPrinterDetailsByIp({ ip, details: result }));
        return result;
      } catch (error) {
        dispatch(
          setPrinterDetailsByIp({
            ip,
            details: { Status: "Disconnected", statusCategory: "Disconnected" },
          })
        );
        throw new Error(error);
      }
    },
    enabled: !!ip,
    refetchInterval: 5000, // 5 sec polling
    retry: false,
  });
};
