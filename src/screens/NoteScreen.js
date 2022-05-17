import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { async } from "@firebase/util";

function formatDate(date) {
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

function Note({ route, navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [noteData, setNoteData] = useState({
    title: "",
    body: "",
    date: new Date(),
    location: null,
    id: null,
    user: null,
    picture: null,
  });
  const [hasGallaryPremission, setHasGallaryPremission] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isPicture, setIsPicture] = useState(false);

  useEffect(() => {
    if (route.params.note) {
      setNoteData(route.params.note);
      if (route.params.note.picture != null) {
        setIsPicture(true);
      }
    }
    if (route.params.status == "edit") {
      setIsEdit(true);
    } else {
      async () => {
        const gallaryStaus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGallaryPremission(gallaryStaus.status === "granted");
      };
      setLocation();
    }
  }, []);

  const pickImage = async () => {
    let pic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(pic);
    if (!pic.cancelled) {
      setNoteData({ ...noteData, picture: pic });
      setIsPicture(true);
    }
  };
  const setLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setNoteData({
      ...noteData,
      location: location.coords,
      id: new Date().toISOString(),
      user: user.uid,
    });
  };

  const onDateChange = (event, selectedDate) => {
    const currDate = selectedDate || noteData.date;
    setShowDate(false);
    setDate(currDate);
    setNoteData({ ...noteData, date: currDate });
  };

  const onSavePressed = async () => {
    if (noteData.title === "") {
      alert("Must enter a title");
      return;
    } else {
      if (isEdit) {
        const note = doc(db, user.uid, noteData.id);
        setDoc(note, noteData, { merge: true })
          .then(() => {
            navigation.goBack();
          })
          .catch((error) => alert(error.message));
      } else {
        const note = doc(db, user.uid, noteData.id);
        setDoc(note, noteData)
          .then(() => {
            navigation.goBack();
          })
          .catch((error) => alert(error.message));
      }
    }
  };

  const onDelete = () => {
    const note = doc(db, user.uid, noteData.id);
    deleteDoc(note)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error.message));
  };

  const displayDeleteAlert = () => {
    Alert.alert(
      "Are You Sure?",
      "This action will delete your note permanently!",
      [
        {
          text: "Delete",
          onPress: onDelete,
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
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 2 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.text_header}>
            {route.params.status == "new"
              ? "Create New Note"
              : route.params.status == "edit"
              ? "Edit: " + route.params.name
              : ""}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.title_view}>
            <Text style={styles.lblTxt}>Title</Text>
            <TextInput
              value={noteData.title}
              style={styles.textInput}
              onChangeText={(text) =>
                setNoteData({
                  ...noteData,
                  title: text,
                })
              }
            />
          </View>
          <View style={styles.body_view}>
            <Text style={styles.lblTxt}>Body</Text>
            <TextInput
              value={noteData.body}
              style={styles.textInput}
              multiline
              onChangeText={(text) =>
                setNoteData({
                  ...noteData,
                  body: text,
                })
              }
            />
          </View>
          <View style={styles.date_view}>
            <Text style={styles.dateTxt}>
              Date: {formatDate(noteData.date)}
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDate(true)}
            >
              <Text style={{ color: "#05375a", fontSize: 18 }}>Change?</Text>
            </TouchableOpacity>
          </View>
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <View style={styles.picture_view}>
            {isPicture && (
              <TouchableOpacity
                style={styles.srcBtn}
                onPress={() => {
                  navigation.push("Pic", {
                    name: noteData.title,
                    uri: noteData.picture.uri,
                  });
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#05375a",
                    fontSize: 22,
                    fontWeight: "bold",
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                  }}
                >
                  Click to see your picture!
                </Text>
              </TouchableOpacity>
            )}
            {!isPicture && (
              <TouchableOpacity
                style={styles.pic_icon}
                onPress={() => pickImage()}
              >
                <Ionicons name="camera" size={35} color={"#4682bf"} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveButton} onPress={onSavePressed}>
              <Text style={styles.buttonTxt}>Save</Text>
            </TouchableOpacity>

            {isEdit && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={displayDeleteAlert}
              >
                <Text style={styles.buttonTxt}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "steelblue",
    paddingTop: 25,
  },
  title_view: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  body_view: {
    flex: 2,
    width: "100%",
    marginBottom: 10,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  picture_view: {
    flex: 0.5,
    width: "100%",
    marginTop: 3,
    flexDirection: "row",
  },

  date_view: {
    width: "100%",
    flex: 0.5,
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    textAlignVertical: "top",
    paddingTop: 10,
    fontSize: 20,
    marginTop: Platform.OS === "ios" ? 0 : 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#05375a",
    borderRadius: 3,
    backgroundColor: "linen",
  },
  saveButton: {
    marginTop: 20,
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#4682bf",
  },
  deleteButton: {
    marginTop: 20,
    marginRight: 20,
    width: "25%",
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "crimson",
  },
  buttonTxt: { fontSize: 18, fontWeight: "300", color: "#fff" },
  header: {
    flex: 0.3,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    alignItems: "center",
    alignContent: "center",
    paddingBottom: 20,
  },
  lblTxt: { color: "black", fontWeight: "400", fontSize: 20 },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  text_header: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 30,
  },
  footer: {
    flex: 5,
    backgroundColor: "gainsboro",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 30,
  },
  actions: {
    flex: 1,
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTxt: { alignSelf: "center", marginRight: 10, fontSize: 25, width: "60%" },
  dateButton: {
    marginRight: 20,
    width: "20%",

    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  srcBtn: {
    width: "100%",
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  pic_icon: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default Note;
