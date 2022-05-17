import React, { useState, useContext } from "react";
import { View, Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";

function secToDate(sec) {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(sec);
  return t;
}

function NotesMap({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [notes, setNotes] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 32.08825,
    longitude: 34.7824,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    React.useCallback(() => {
      getNotes();
    }, [])
  );

  const getNotes = async () => {
    const querySnapshot = await getDocs(collection(db, user.uid));
    let newNotes = [];

    querySnapshot.forEach((d) => {
      let note = d.data();
      note.id = d.id;
      note.date = secToDate(note.date.seconds);
      newNotes.push(note);
    });
    setNotes(newNotes);
  };
  const onMarkerPressed = (note) => {
    Alert.alert(
      "Edit a note",
      "Do you wont to edit: '" + note.title + "'?",
      [
        {
          text: "Edit",
          onPress: () =>
            navigation.push("Note", {
              name: note.title,
              note: note,
              status: "edit",
            }),
        },
        {
          text: "Cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes Map</Text>
      <View style={styles.map}>
        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          region={mapRegion}
        >
          {notes.map((note) => {
            return (
              <Marker
                key={note.id}
                onPress={() => onMarkerPressed(note)}
                coordinate={note.location}
                title={note.title}
              />
            );
          })}
        </MapView>
        <TouchableOpacity
          style={styles.add}
          onPress={() =>
            navigation.push("Note", { name: "Add New Note ", status: "new" })
          }
        >
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "steelblue",
  },
  header: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "300",
    alignSelf: "center",
    paddingTop: 10,
    flex: 0.1,
  },
  map: {
    flex: 1,
    backgroundColor: "gainsboro",
  },
  add: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "steelblue",
    position: "absolute",
    bottom: 10,
    left: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  addBtn: {
    fontSize: 50,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Roboto",
  },
});

export default NotesMap;
