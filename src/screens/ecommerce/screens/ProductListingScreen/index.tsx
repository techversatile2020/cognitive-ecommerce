import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BottomSheetModal,
  CustomImage,
  Loader,
  MainContainer,
  MainHeader,
  Text,
} from "../../../../components";
import {
  BrandFilterContent,
  CategoryFilterContent,
  PriceRangeFilterContent,
  ProductCard,
  SearchBar,
  Segments,
} from "../../components";
import { Images } from "../../../../config";
import { SD } from "../../../../utils";
import { ThemeColors } from "../../../../styles";
import { useFilteredProducts, useProducts } from "../../../../graphql";

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
  const { getAllProducts } = useProducts();
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const applyAllFilters = async () => {
      setIsLoading(true);
      if (!getAllProducts) return;
      const allProducts = await getAllProducts();
      let filtered = allProducts;
      if (search && search.trim().length > 0) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.node.title.toLowerCase().includes(q) ||
            p.node.vendor.toLowerCase().includes(q)
        );
      }
      if (category && category.length > 0) {
        filtered = filtered.filter(
          (p) => p.node.productType?.toLowerCase() === category.toLowerCase()
        );
      }
      if (brands && brands.length > 0) {
        filtered = filtered.filter((p) => brands.includes(p.node.vendor));
      }
      if (priceRange) {
        filtered = filtered.filter((p) => {
          const price = parseFloat(
            p.node.variants.edges[0].node.priceV2.amount
          );
          return price >= priceRange.min && price <= priceRange.max;
        });
      }
      setPrinters(filtered);
      setIsLoading(false);
    };

    applyAllFilters();
  }, [priceRange, category, brands, search]);

  const handleChange = (e) => {
    setShowModal(true);
    setActiveFilter(e);
  };

  const handlePriceRangeApply = (r) => {
    setPriceRange(r);
    setShowModal(false);
  };

  return (
    <MainContainer>
      <MainHeader
        back
        title={title}
        headerTitleStyles={{
          fontSize: SD.customFontSize(24),
        }}
      />
      <SearchBar search={search} setSearch={setSearch} />
      <View style={{ height: SD.hp(60) }}>
        <Segments data={segmentsData} handleChange={handleChange} />
      </View>

      <FlatList
        data={printers}
        renderItem={({ item, index }) => <ProductCard data={item} />}
        keyExtractor={(item: any) => item?.node?.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ marginTop: SD.hp(10) }}
        showsVerticalScrollIndicator={false}
      />
      <Loader visible={isLoading} text="Fetching products..." />
      <BottomSheetModal visible={showModal} onClose={() => setShowModal(false)}>
        {activeFilter === 1 && (
          <CategoryFilterContent
            selectedCategory={category}
            onSelect={setCategory}
          />
        )}
        {activeFilter === 2 && (
          <PriceRangeFilterContent
            initialRange={priceRange}
            onApply={handlePriceRangeApply}
          />
        )}
        {activeFilter === 3 && (
          <BrandFilterContent selectedBrands={brands} onSelect={setBrands} />
        )}
      </BottomSheetModal>
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
