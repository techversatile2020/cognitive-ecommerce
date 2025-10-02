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
    const { data }: any = await signupMutation({ variables: { input } });
    return data.customerCreate;
  };

  const login = async (input) => {
    const { data }: any = await loginMutation({ variables: { input } });
    return data.customerAccessTokenCreate;
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
