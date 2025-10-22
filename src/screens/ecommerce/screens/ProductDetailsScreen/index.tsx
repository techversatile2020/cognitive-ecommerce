import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks";
import { ThemeColors } from "../../../../styles";
import {
  CustomImage,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  Text,
} from "../../../../components";
import { SD, Toast } from "../../../../utils";
import { Images } from "../../../../config";
import { Counter } from "../../components";
import { useCart, useProducts } from "../../../../graphql";

export const ProductDetailsScreen = ({ route }: any) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  const { id } = route?.params;

  const [liked, setLiked] = useState(false);
  const [printer, setPrinter]: any = useState({});
  const [priceInfo, setPriceInfo]: any = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { getProductById } = useProducts();
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    let response = await addToCart({
      variantId: priceInfo?.id,
      quantity: quantity,
    });
    if (response?.id) {
      Toast.success("Product added to cart successfully!");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const fetchPrinterDetails = async () => {
      setIsLoading(true);
      let response = await getProductById(id);
      console.log("prince.id => ", response);
      setPrinter(response);
      setPriceInfo(response?.variants?.edges[0]?.node);
      setIsLoading(false);
    };
    fetchPrinterDetails();
  }, [id]);

  return (
    <MainContainer isFlatList>
      <MainHeader
        back
        title={"Product Details"}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      <View style={styles.imageViewContainer}>
        <CustomImage
          source={
            printer?.images
              ? { uri: printer?.images?.edges[0]?.node?.originalSrc }
              : Images.printer
          }
          style={styles.printerImage}
        />
        <Pressable
          style={styles.heartIconView}
          onPress={() => setLiked((prev) => !prev)}
        >
          <CustomImage
            source={Images.heart}
            style={[styles.heartIcon, liked && { tintColor: "#FF5151" }]}
          />
        </Pressable>
      </View>
      <View style={styles.infoSection}>
        <Text extraBold size={20}>
          {priceInfo?.priceV2?.currencyCode} {priceInfo?.priceV2?.amount}
        </Text>
        <Text semiBold size={20} topSpacing={5}>
          {printer?.title}
        </Text>
        <Text
          regular
          size={14}
          color="#868D94"
          topSpacing={5}
          bottomSpacing={10}
        >
          Model: DBD24/DBT24-2085-xxx
        </Text>

        <Text regular size={14} color="#868D94">
          <Text bold size={14} color="black">
            Product Desctipion:
          </Text>{" "}
          {printer?.description}
        </Text>

        <View style={{ marginVertical: SD.hp(20) }}>
          <ListOptionsCard title="Vendor" value={printer?.vendor} />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Counter counter={quantity} setCounter={setQuantity} />
        <PrimaryButton
          title="Add to cart"
          customStyles={{ width: "47%" }}
          onPress={handleAddToCart}
        />
      </View>
      <Loader
        visible={isLoading || loading}
        text="Fetching product details..."
      />
    </MainContainer>
  );
};

const ListOptionsCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  const { AppTheme }: any = useTheme();
  const styles = createStyles(AppTheme);
  return (
    <View style={styles.listText}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <View style={styles.dot} />
        <Text regular size={13} color={AppTheme.Black}>
          {title}
        </Text>
      </View>
      <Text regular size={13} color="#000000" style={{ opacity: 0.4 }}>
        {value}
      </Text>
    </View>
  );
};

const createStyles = (colors: typeof ThemeColors) =>
  StyleSheet.create({
    imageViewContainer: {
      height: SD.hp(350),
      backgroundColor: colors.lightBlue,
      padding: SD.wp(10),
      borderRadius: 14,
      marginTop: SD.hp(10),
      alignItems: "center",
      justifyContent: "center",
    },
    imageView: {
      backgroundColor: colors.Base,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    printerImage: {
      width: "70%",
      height: "70%",
      resizeMode: "contain",
    },
    heartIconView: {
      width: SD.wp(45),
      height: SD.wp(45),
      borderRadius: 100,
      backgroundColor: colors.lightBlue,
      position: "absolute",
      top: 5,
      right: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    heartIcon: {
      width: SD.wp(21),
      height: SD.wp(21),
      resizeMode: "contain",
    },
    infoSection: {
      marginTop: SD.hp(20),
      paddingLeft: SD.wp(10),
      flex: 1,
    },
    listText: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: 10,
      marginTop: SD.hp(5),
      justifyContent: "space-between",
    },
    dot: {
      width: SD.wp(5),
      height: SD.hp(5),
      borderRadius: 100,
      backgroundColor: "black",
    },
  });
