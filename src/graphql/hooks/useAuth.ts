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
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/reducers/auth.slice";

export const useAuth = () => {
  const [signupMutation] = useMutation(CUSTOMER_CREATE);
  const [loginMutation] = useMutation(CUSTOMER_LOGIN);
  const [recoverMutation] = useMutation(CUSTOMER_RECOVER);
  const [getCustomerQuery] = useLazyQuery(GET_CUSTOMER);
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);

  const signup = async (input) => {
    try {
      const { data }: any = await signupMutation({ variables: { input } });
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

  const recover = async (email, fromSettings = false) => {
    try {
      const { data }: any = await recoverMutation({ variables: { email } });
      console.log("data::", data);
      if (!fromSettings) {
        if (data?.customerRecover?.customerUserErrors?.length == 0) {
          NavigationService.reset_0(AuthScreenNames.LoginScreen);
        }
      }
      return data.customerRecover;
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  const getCustomer = async (userToken = token) => {
    try {
      const { data }: any = await getCustomerQuery({
        variables: { customerAccessToken: userToken },
      });
      if (data?.customer) {
        dispatch(setUser(data?.customer));
      }
      return data.customer;
    } catch (error) {
      return error;
    }
  };

  return { signup, login, recover, getCustomer };
};
