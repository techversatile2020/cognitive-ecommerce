import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  Text,
} from "../../../../components";
import { SearchBar, Segments } from "../../components";
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
      <MainHeader back title={title} />
      <SearchBar />
      <View style={{ height: SD.hp(60) }}>
        <Segments data={segmentsData} />
      </View>
      <Text>Helo</Text>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
