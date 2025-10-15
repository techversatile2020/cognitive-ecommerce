import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
  CUSTOMER_CREATE,
  CUSTOMER_LOGIN,
  CUSTOMER_RECOVER,
  GET_CUSTOMER,
} from "../queries/auth";
import { Toast } from "../../utils";
import { NavigationService } from "../../config";
import { AuthScreenNames } from "../../config/ScreenNames";
import { toast } from "../../utils/toast.utils";
import { CUSTOMER_UPDATE, CUSTOMER_UPDATE_PASSWORD } from "../queries/user";

export const useUser = () => {
  const [updateCustomerMutation] = useMutation(CUSTOMER_UPDATE);
  const [updatePasswordMutation] = useMutation(CUSTOMER_UPDATE_PASSWORD);
  // ✅ Update name, email, or phone
  const updateCustomer = async (token, customer) => {
    try {
      const { data }: any = await updateCustomerMutation({
        variables: {
          customerAccessToken: token,
          customer,
        },
      });
      return data.customerUpdate;
    } catch (error) {
      return handleError(error);
    }
  };
  // ✅ Change password
  const updatePassword = async (token, password) => {
    try {
      const { data }: any = await updatePasswordMutation({
        variables: {
          customerAccessToken: token,
          customer: { password },
        },
      });
      return data.customerUpdate;
    } catch (error) {
      return handleError(error);
    }
  };

  const handleError = (error) => {
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
  };

  return {
    updateCustomer,
    updatePassword,
  };
};
