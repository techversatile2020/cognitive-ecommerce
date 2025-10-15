import { gql } from "@apollo/client";

export const ADD_FAVORITE = gql`
  mutation addFavorite(
    $customerAccessToken: String!
    $namespace: String!
    $key: String!
    $value: String!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: {
        metafields: [
          {
            namespace: $namespace
            key: $key
            type: "single_line_text_field"
            value: $value
          }
        ]
      }
    ) {
      customer {
        id
        metafield(namespace: $namespace, key: $key) {
          id
          key
          value
        }
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query getFavorites($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafields(first: 5, namespace: "favorites") {
        edges {
          node {
            key
            value
          }
        }
      }
    }
  }
`;
