import React, { useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";

function formatDate(_date) {
  return (
    _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear()
  );
}

function secToDate(sec) {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(sec);
  return t;
}
function NotesList({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);

  const [notes, setNotes] = useState([]);

  const openNoteDetail = (item) => {
    navigation.push("Note", { name: item.title, note: item, status: "edit" });
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes List</Text>
      <FlatList
        data={notes}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteBox}
            onPress={() => openNoteDetail(item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.add}
        onPress={() =>
          navigation.push("Note", { name: "Add New Note ", status: "new" })
        }
      >
        <Text style={styles.addBtn}>+</Text>
      </TouchableOpacity>
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
  list: {
    flex: 1,
    backgroundColor: "gainsboro",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  noteBox: {
    backgroundColor: "#def",
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  title: { fontSize: 20, color: "black", fontWeight: "700" },
  date: {
    fontSize: 15,
    color: "black",
    fontWeight: "200",
    alignSelf: "flex-start",
  },
});

export default NotesList;
