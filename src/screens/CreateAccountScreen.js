import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { app } from "../firebase/FirebaseConfig";

function CreateAccount({ navigation }) {
  const [data, setData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    isValid: true,
  });
  const [errorMsg, setErrorMsg] = React.useState("");

  const auth = getAuth(app);
  const onSignUpPressed = () => {
    if (
      data.email.length == 0 ||
      data.password.length == 0 ||
      data.confirmPassword.length == 0
    ) {
      setData({
        ...data,
        isValid: false,
        password: "",
        confirmPassword: "",
        email: "",
      });
      setErrorMsg("Empty Email/Password");
      return;
    }
    if (data.password != data.confirmPassword) {
      setData({
        ...data,
        isValid: false,
        password: "",
        confirmPassword: "",
        email: "",
      });
      setErrorMsg("Passwords do not match");
      return;
    }
    //Firebase:
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setData({
          ...data,
          isValid: true,
          password: "",
          confirmPassword: "",
          email: "",
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Sign-Up to MyNotes!</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.action}>
          <TextInput
            value={data.email}
            onChangeText={(text) => {
              setData({
                ...data,
                isValid: true,

                email: text,
              });
              setErrorMsg("");
            }}
            style={styles.textInput}
            placeholder="Email"
          />
        </View>
        <View style={styles.action}>
          <TextInput
            value={data.password}
            style={styles.textInput}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(text) => {
              setData({
                ...data,
                isValid: true,
                password: text,
              });
              setErrorMsg("");
            }}
          />
        </View>
        <View style={styles.action}>
          <TextInput
            value={data.confirmPassword}
            style={styles.textInput}
            placeholder="Confirm Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(text) => {
              setData({
                ...data,
                isValid: true,
                confirmPassword: text,
              });
              setErrorMsg("");
            }}
          />
        </View>
        {data.isValid == false && (
          <View style={styles.actionError}>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.signIn} onPress={onSignUpPressed}>
          <Text style={styles.textSign}>Sign Up</Text>
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

export default CreateAccount;
