import NotesMap from "../screens/NotesMapScreen.js";
import NotesList from "../screens/NotesListScreen.js";
import Note from "../screens/NoteScreen.js";
import Home from "../screens/HomeScreen.js";
import ShowPicture from "../components/ShowPicture.js";
import { Ionicons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator initialRouteName="Home">
    <Tabs.Screen
      name="Map"
      component={NotesMap}
      options={{
        headerShown: false,
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="map"
              size={24}
              color={tabInfo.focused ? "#4682bf" : "#8e8e93"}
            />
          );
        },
      }}
    />
    <Tabs.Screen
      name="List"
      component={NotesList}
      options={{
        headerShown: false,
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="list"
              size={24}
              color={tabInfo.focused ? "#4682bf" : "#8e8e93"}
            />
          );
        },
      }}
    />
    <Tabs.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="md-home"
              size={24}
              color={tabInfo.focused ? "#4682bf" : "#8e8e93"}
            />
          );
        },
      }}
    />
  </Tabs.Navigator>
);

const MainStack = createStackNavigator();

export default function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Tabs"
        component={TabsScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Note"
        component={Note}
        options={({ route }) => ({
          title: route.params.name,
          headerStyle: {
            backgroundColor: "#4682cf",
          },
          headerTintColor: "#fff",
        })}
      />
      <MainStack.Screen
        name="Pic"
        component={ShowPicture}
        options={({ route }) => ({
          title: route.params.name,
          headerStyle: {
            backgroundColor: "#4682cf",
          },
          headerTintColor: "#fff",
        })}
      />
    </MainStack.Navigator>
  );
}
