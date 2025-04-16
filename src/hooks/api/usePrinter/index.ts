import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrinterDetails } from "../../../services/printerServices";
import { setPrinterDetailsByIp } from "../../../redux/reducers";
import { toast } from "../../../utils/toast.utils";

export const usePrinter = (ip) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["printer-status", ip],
    queryFn: async () => {
      if (!ip) throw new Error("IP not set");
      console.log(`Background fetching for ${ip}`);

      try {
        const result = await fetchPrinterDetails(ip);
        dispatch(setPrinterDetailsByIp({ ip, details: result }));
        return result;
      } catch (error) {
        dispatch(
          setPrinterDetailsByIp({
            ip,
            details: { Status: "Offline", statusCategory: "WARNING" },
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
