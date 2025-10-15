import { gql } from "@apollo/client";

// ✅ Update customer info
export const CUSTOMER_UPDATE = gql`
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

// ✅ Change password
export const CUSTOMER_UPDATE_PASSWORD = gql`
  mutation customerUpdatePassword(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        email
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;
