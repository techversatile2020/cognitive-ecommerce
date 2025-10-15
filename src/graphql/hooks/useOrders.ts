import { useLazyQuery } from "@apollo/client/react";
import { GET_ORDERS } from "../queries/orders";

export const useOrders = () => {
  const [getOrdersQuery, { data, loading, error, refetch }]: any =
    useLazyQuery(GET_ORDERS);

  const getOrders = async (token: string) => {
    try {
      const { data }: any = await getOrdersQuery({
        variables: { customerAccessToken: token },
        // fetchPolicy: "network-only", // ensures fresh data
      });

      return data?.customer?.orders?.edges?.map((edge) => edge.node) || [];
    } catch (err) {
      console.log("Error fetching orders:", err);
      return [];
    }
  };

  return {
    getOrders,
    orders: data?.customer?.orders?.edges || [],
    loading,
    error,
    refetch,
  };
};
