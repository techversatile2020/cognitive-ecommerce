import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          vendor
          productType
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_TYPE = gql`
  query getProductsByType($productType: String!, $first: Int!) {
    products(first: $first, query: $productType) {
      edges {
        node {
          id
          title
          vendor
          productType
          description
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_PRINTER = gql`
  query getProductsByPrinter($printerName: String!, $first: Int!) {
    products(first: $first, query: $printerName) {
      edges {
        node {
          id
          title
          vendor
          productType
          description
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_PRINTER_SUPPLIES = gql`
  query getPrinterSupplies($first: Int!, $printerName: String) {
    products(first: $first, query: "Printer Supplies ") {
      edges {
        node {
          id
          title
          vendor
          productType
          description
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      vendor
      productType
      images(first: 10) {
        edges {
          node {
            originalSrc
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            sku
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_FILTERED_PRODUCTS = gql`
  query getFilteredProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          description
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
