import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
  ADD_TO_CART,
  CREATE_CART,
  GET_CART,
  UPDATE_CART_LINE,
} from "../queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCart = () => {
  const [
    addToCartMutation,
    { data: addData, loading: addLoading, error: addError },
  ] = useMutation(ADD_TO_CART);

  const [createCartMutation] = useMutation(CREATE_CART);
  const [updateCartLineMutation] = useMutation(UPDATE_CART_LINE);

  const [
    getCartQuery,
    { data: cartData, loading: cartLoading, error: cartError, refetch },
  ] = useLazyQuery(GET_CART);

  // 🔹 Add item to cart
  const addToCart = async ({ cartId, variantId, quantity }: any) => {
    try {
      let activeCartId = cartId || (await AsyncStorage.getItem("cartId"));
      console.log("🛒 Active Cart ID:", activeCartId);

      // If no existing cart, create one
      if (!activeCartId) {
        return await createNewCart(variantId, quantity);
      }

      // Try adding to existing cart
      const { data }: any = await addToCartMutation({
        variables: {
          cartId: activeCartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      });

      const userErrors = data?.cartLinesAdd?.userErrors || [];

      // If cart was invalidated, recreate it
      if (userErrors.some((e: any) => e.message.includes("does not exist"))) {
        console.log("⚠️ Cart invalid, creating new one...");
        await AsyncStorage.removeItem("cartId");
        return await createNewCart(variantId, quantity);
      }

      const newCart = data?.cartLinesAdd?.cart;
      if (newCart?.id) {
        await AsyncStorage.setItem("cartId", newCart.id);
      }

      return newCart;
    } catch (err) {
      console.error("❌ Add to cart error:", err);
      throw err;
    }
  };

  // 🔹 Create a new cart and add item
  const createNewCart = async (variantId: string, quantity: number) => {
    const { data }: any = await createCartMutation({
      variables: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    });
    const newCartId = data?.cartCreate?.cart?.id;
    if (newCartId) {
      await AsyncStorage.setItem("cartId", newCartId);
    }
    return data?.cartCreate?.cart;
  };

  const getCart = async (cartId?: string) => {
    try {
      // 🔹 Use passed cartId or restore from AsyncStorage
      let activeCartId = cartId || (await AsyncStorage.getItem("cartId"));
      if (!activeCartId) return null;
      console.log("activeCartId: ", activeCartId);

      const { data }: any = await getCartQuery({
        variables: { cartId: activeCartId },
        // fetchPolicy: "network-only",
      });
      console.log("data: ", data);

      return data?.cart || [];
    } catch (err) {
      console.error("Get cart error:", err);
      throw err;
    }
  };

  // 🔹 Clear cart after checkout success
  const clearCart = async () => {
    await AsyncStorage.removeItem("cartId");
  };

  const updateCartLine = async (cartId, lineId, quantity) => {
    try {
      const { data }: any = await updateCartLineMutation({
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
        },
      });

      const res = data?.cartLinesUpdate;
      const errors = res?.userErrors ?? [];

      if (errors.length > 0) {
        console.warn("⚠️ Shopify cart update error:", errors);
        return null;
      }

      const updatedCart = res?.cart;
      if (updatedCart) {
        console.log("✅ Cart updated successfully:", updatedCart);
      } else {
        console.warn("⚠️ No cart returned from Shopify.");
      }

      return updatedCart;
    } catch (err) {
      console.error("❌ Update cart line failed:", err);
      return null;
    }
  };

  return {
    addToCart,
    getCart,
    addData,
    cartData,
    loading: addLoading || cartLoading,
    error: addError || cartError,
    clearCart,
    refetch,
    updateCartLine,
  };
};
