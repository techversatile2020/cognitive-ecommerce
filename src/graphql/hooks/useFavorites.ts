import { useMutation, useLazyQuery } from "@apollo/client/react";
import { ADD_FAVORITE, GET_FAVORITES } from "../queries/favorites";

export const useFavorites = () => {
  const [addFavoriteMutation] = useMutation(ADD_FAVORITE);
  const [getFavoritesQuery] = useLazyQuery(GET_FAVORITES);

  const addFavorite = async (
    customerAccessToken,
    productId,
    existingFavorites = []
  ) => {
    try {
      const updatedFavorites = JSON.stringify([
        ...existingFavorites,
        productId,
      ]);

      const { data }: any = await addFavoriteMutation({
        variables: {
          customerAccessToken,
          namespace: "favorites",
          key: "products",
          value: updatedFavorites,
        },
      });

      const errors = data?.customerUpdate?.customerUserErrors;
      if (errors?.length) {
        console.log("Shopify Errors:", errors);
        return { error: errors[0].message };
      }

      return data?.customerUpdate?.customer?.metafield?.value;
    } catch (error) {
      console.log("addFavorite Error:", error);
      return { error: error.message };
    }
  };

  const getFavorites = async (customerAccessToken) => {
    try {
      const { data }: any = await getFavoritesQuery({
        variables: { customerAccessToken },
        // fetchPolicy: "network-only",
      });

      const node = data?.customer?.metafields?.edges?.[0]?.node;
      return node?.value ? JSON.parse(node.value) : [];
    } catch (error) {
      console.log("getFavorites Error:", error);
      return [];
    }
  };

  return { addFavorite, getFavorites };
};
