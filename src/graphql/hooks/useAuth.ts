import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
  CUSTOMER_CREATE,
  CUSTOMER_LOGIN,
  CUSTOMER_RECOVER,
  GET_CUSTOMER,
} from "../queries/auth";

export const useAuth = () => {
  const [signupMutation] = useMutation(CUSTOMER_CREATE);
  const [loginMutation] = useMutation(CUSTOMER_LOGIN);
  const [recoverMutation] = useMutation(CUSTOMER_RECOVER);
  const [getCustomerQuery] = useLazyQuery(GET_CUSTOMER);

  const signup = async (input) => {
    try {
      const { data }: any = await signupMutation({ variables: { input } });
      // console.log("Data => ", data);

      return data.customerCreate;
    } catch (error) {
      if (error.graphQLErrors?.length) {
        console.log("GraphQL Error:", error.graphQLErrors[0].message);
        return { error: error.graphQLErrors[0].message };
      } else if (error.networkError) {
        console.log("Network Error:", error.networkError.message);
        return { error: error.networkError.message };
      } else {
        console.log("Unknown Error:", error.message);
        return { error: error.message };
      }
    }
  };

  const login = async (input) => {
    try {
      const { data }: any = await loginMutation({ variables: { input } });
      return data.customerAccessTokenCreate;
    } catch (error) {
      return error;
    }
  };

  const recover = async (email) => {
    const { data }: any = await recoverMutation({ variables: { email } });
    return data.customerRecover;
  };

  const getCustomer = async (token) => {
    const { data }: any = await getCustomerQuery({
      variables: { customerAccessToken: token },
    });
    return data.customer;
  };

  return { signup, login, recover, getCustomer };
};
