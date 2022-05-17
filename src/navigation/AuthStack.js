import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/LoginScreen.js";
import CreateAccount from "../screens/CreateAccountScreen.js";
import React from "react";

const AuthStack = createStackNavigator();
export default function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{ title: "Sign up to MyNotes", headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}
