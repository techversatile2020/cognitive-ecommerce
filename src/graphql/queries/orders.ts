import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query getOrders($customerAccessToken: String!, $first: Int = 10) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    image {
                      src
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            shippingAddress {
              name
              address1
              city
              country
            }
          }
        }
      }
    }
  }
`;
