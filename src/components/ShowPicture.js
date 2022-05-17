import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";

function ShowPicture({ route, navigation }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: route.params.uri }} style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonTxt}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25, backgroundColor: "steelblue" },
  backButton: {
    flex: 0.1,
    marginTop: 20,
    marginBottom: 20,
    width: "90%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "gainsboro",
  },
  buttonTxt: { fontSize: 21, fontWeight: "500", color: "black" },
});
export default ShowPicture;
