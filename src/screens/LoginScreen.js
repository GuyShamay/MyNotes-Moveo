import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import "firebase/auth";
import { app } from "../firebase/FirebaseConfig.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login({ navigation }) {
  const [data, setData] = React.useState({
    email: "",
    password: "",
    isValid: true,
  });

  const [errorMsg, setErrorMsg] = React.useState("");

  const auth = getAuth(app);

  const onLoginPressed = () => {
    if (data.email.length == 0 || data.password.length == 0) {
      setData({
        isValid: false,
        password: "",
        email: "",
      });
      setErrorMsg("Empty Email/Password");
      return;
    }
    setData({ ...data, isValid: true });

    // Firebase Auth:
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setData({
          ...data,
          isValid: true,
          password: "",
          email: "",
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome to MyNotes!</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.action}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={(text) =>
              setData({
                ...data,
                email: text,
              })
            }
          />
        </View>
        <View style={styles.action}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(text) =>
              setData({
                ...data,
                password: text,
              })
            }
          />
        </View>
        {data.isValid == false && (
          <View style={styles.actionError}>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.signIn} onPress={onLoginPressed}>
          <Text style={styles.textSign}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUp}
          onPress={() => navigation.push("CreateAccount")}
        >
          <Text style={styles.text_footer}>New User? Click to Sign-Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "steelblue",
  },
  signUp: {
    marginTop: 25,
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "gainsboro",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    height: 40,
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
    alignSelf: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    marginTop: 70,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682bf",
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
export default Login;
