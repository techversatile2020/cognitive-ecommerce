import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  Text,
} from "../../../../components";
import { ProductCard, SearchBar, Segments } from "../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";
import { ThemeColors } from "../../../../styles";

const segmentsData = [
  {
    id: 1,
    title: "Category",
  },
  {
    id: 2,
    title: "Price Range",
  },
  {
    id: 3,
    title: "Brand",
  },
];

export const ProductListingScreen = ({ route }: any) => {
  const { title } = route?.params || {};
  return (
    <MainContainer>
      <MainHeader
        back
        title={title}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      <SearchBar />
      <View style={{ height: SD.hp(60) }}>
        <Segments data={segmentsData} />
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={() => <ProductCard />}
        keyExtractor={(item: any) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ marginTop: SD.hp(10) }}
        showsVerticalScrollIndicator={false}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
});
