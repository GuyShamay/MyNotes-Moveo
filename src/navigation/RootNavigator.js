import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import MainStackScreen from "./MainStack";
import AuthStackScreen from "./AuthStack";
import { app } from "../firebase/FirebaseConfig";

const auth = getAuth(app);

export default function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser)
            : setUser(null));
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
