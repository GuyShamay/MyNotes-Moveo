import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import "firebase/auth";
import { app } from "../firebase/FirebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";

const auth = getAuth(app);

function Home({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);

  const onLogoutPressed = () =>
    signOut(auth)
      .then(() => {})
      .catch((error) => alert(error));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome to MyNotes!</Text>
        <Text style={styles.text_header2}>
          Location based notes application.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>User: {user.email}</Text>

        <TouchableOpacity style={styles.button} onPress={onLogoutPressed}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "steelblue",
    paddingTop: 25,
  },
  button: {
    marginTop: 20,
    width: "80%",
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682bf",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    paddingTop: 240,
  },
  textLogout: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    alignItems: "center",
    alignContent: "center",
    paddingBottom: 50,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_header2: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "200",
    fontSize: 20,
    justifyContent: "center",
  },
  footer: {
    flex: 2,
    backgroundColor: "gainsboro",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 80,
  },
});

export default Home;
