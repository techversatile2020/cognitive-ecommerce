import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity, Image } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SD } from "../../utils";
import { Images } from "../../config";
import { useCart } from "../../graphql";
import { Buffer } from "buffer";

export const SwipeableProductCard = ({
  item,
  refetchCart,
  ProductCard,
  cartId,
}) => {
  const swipeRef = useRef(null);
  const { removeCartItem } = useCart();
  const handleDelete = async () => {
    try {
      await removeCartItem(cartId, item?.node?.id);
      refetchCart();
      swipeRef.current?.close();
    } catch (error) {
      console.log("ERROR HANDLE DELETE => ", error);
      swipeRef.current?.close();
    }
  };

  const renderRightActions = (progress, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ff3b30",
          height: SD.hp(100),
          alignSelf: "center",
          width: "30%",
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          alignContent: "center",
          top: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleDelete}
          activeOpacity={0.8}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={Images.trash}
            style={{
              width: SD.wp(22),
              height: SD.wp(22),
              tintColor: "#fff",
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2.8}
      rightThreshold={90}
      useNativeAnimations
      onSwipeableOpenStartDrag={() => {
        console.log("its opening");
        // setSliding(true);
      }}
      onSwipeableClose={() => {
        console.log("Closed back");
        // setSliding(false);
      }}
    >
      <ProductCard data={item} refetchCart={refetchCart} />
    </Swipeable>
  );
};
