import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GET_FILTERED_PRODUCTS,
  GET_PRINTER_SUPPLIES,
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS,
  GET_PRODUCTS_BY_PRINTER,
  GET_PRODUCTS_BY_TYPE,
} from "../queries";

export const useProducts = () => {
  const [getAllProductsQuery, allProductsData] = useLazyQuery(GET_PRODUCTS);
  const [getProductsByTypeQuery, productsByTypeData] =
    useLazyQuery(GET_PRODUCTS_BY_TYPE);
  const [getProductsByPrinterQuery, productsByPrinterData] = useLazyQuery(
    GET_PRODUCTS_BY_PRINTER
  );
  const [getPrinterSuppliesQuery, printerSuppliesData] =
    useLazyQuery(GET_PRINTER_SUPPLIES);
  const [getProductByIdQuery, productByIdData] =
    useLazyQuery(GET_PRODUCT_BY_ID); // 👈 new lazy query

  const getAllProducts = async (first = 10) => {
    try {
      const { data }: any = await getAllProductsQuery({ variables: { first } });
      return data?.products?.edges || [];
    } catch (error: any) {
      console.log("Error fetching all products:", error.message);
      return { error: error.message };
    }
  };

  const getProductsByType = async (productType: string, first = 10) => {
    try {
      const { data }: any = await getProductsByTypeQuery({
        variables: { productType, first },
      });
      return data?.products?.edges || [];
    } catch (error: any) {
      console.log(
        `Error fetching products by type ${productType}:`,
        error.message
      );
      return { error: error.message };
    }
  };

  const getProductsByPrinter = async (printerName: string, first = 10) => {
    try {
      const { data }: any = await getProductsByPrinterQuery({
        variables: { printerName, first },
      });
      return data?.products?.edges || [];
    } catch (error: any) {
      console.log(
        `Error fetching products for printer ${printerName}:`,
        error.message
      );
      return { error: error.message };
    }
  };

  const getPrinterSupplies = async (printerName?: string, first = 10) => {
    try {
      const { data }: any = await getPrinterSuppliesQuery({
        variables: { printerName, first },
      });
      return data?.products?.edges || [];
    } catch (error: any) {
      console.log(`Error fetching printer supplies:`, error.message);
      return { error: error.message };
    }
  };

  const getProductById = async (id: string) => {
    try {
      const { data }: any = await getProductByIdQuery({
        variables: { id },
      });

      return data?.product || null;
    } catch (error: any) {
      console.log(`Error fetching product by ID ${id}:`, error.message);
      return { error: error.message };
    }
  };
  return {
    getAllProducts,
    getProductsByType,
    getProductsByPrinter,
    getPrinterSupplies,
    allProductsData,
    productsByTypeData,
    productsByPrinterData,
    printerSuppliesData,
    getProductById,
  };
};

export const useFilteredProducts = () => {
  const [getFilteredProducts, { data, loading, error }]: any = useLazyQuery(
    GET_FILTERED_PRODUCTS
  );

  const fetchProducts = async (filters) => {
    const queryString = buildShopifyQuery(filters);
    await getFilteredProducts({ variables: { first: 20, query: queryString } });
  };

  return {
    fetchProducts,
    products: data?.products?.edges || [],
    loading,
    error,
  };
};

//helper qury builder
const buildShopifyQuery = ({ category, brand, priceRange }) => {
  let queryParts = [];

  if (category) queryParts.push(`product_type:'${category}'`);
  if (brand) queryParts.push(`vendor:'${brand}'`);
  if (priceRange?.min && priceRange?.max)
    queryParts.push(`price:>${priceRange.min} AND price:<${priceRange.max}`);

  return queryParts.join(" AND ");
};
