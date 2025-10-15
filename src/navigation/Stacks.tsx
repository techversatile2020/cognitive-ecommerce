import { AuthScreenNames } from "../config/ScreenNames";
import {
  ForgotPassword,
  LoginScreen,
  SignupScreen,
} from "../screens/authScreens";

export const AuthScreens = [
  {
    id: 1,
    name: AuthScreenNames.LoginScreen,
    component: LoginScreen,
  },
  {
    id: 2,
    name: AuthScreenNames.SignupScreen,
    component: SignupScreen,
  },
  {
    id: 3,
    name: AuthScreenNames.ForgotPassword,
    component: ForgotPassword,
  },
];
