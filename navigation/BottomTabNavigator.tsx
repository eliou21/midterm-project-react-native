import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import JobFinderScreen from "../screens/JobFinderScreen";
import SavedJobsScreen from "../screens/SavedJobsScreen";
import { useDarkMode } from "../context/DarkModeContext";
import { RootStackParamList } from "../types/types";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function BottomTabNavigator() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useDarkMode();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "JobFinder") {
            iconName = "briefcase";
          } else if (route.name === "SavedJobs") {
            iconName = "heart";
          } else if (route.name === "Welcome") {
            iconName = "exit-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode
          ? darkStyles.tabBarActiveTintColor.color
          : lightStyles.tabBarActiveTintColor.color,
        tabBarInactiveTintColor: isDarkMode
          ? darkStyles.tabBarInactiveTintColor.color
          : lightStyles.tabBarInactiveTintColor.color,
        headerShown: false,
        tabBarStyle: isDarkMode ? darkStyles.tabBar : lightStyles.tabBar,
      })}
    >
      <Tab.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={{
          title: "Find Jobs",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              style={isDarkMode ? darkStyles.tabButton : lightStyles.tabButton}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{
          title: "Saved Jobs",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              style={isDarkMode ? darkStyles.tabButton : lightStyles.tabButton}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Welcome"
        component={() => null}
        options={{
          title: "Exit",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              style={isDarkMode ? darkStyles.tabButton : lightStyles.tabButton}
              onPress={() => navigation.navigate("Welcome")}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const lightStyles = StyleSheet.create({

  tabBar: {
    backgroundColor: "rgb(94, 9, 15)",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  tabBarActiveTintColor: {
    color: "#EFDFC5",
  },

  tabBarInactiveTintColor: {
    color: "rgb(216, 216, 216)",
  },

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
});

const darkStyles = StyleSheet.create({
  
  tabBar: {
    backgroundColor: "#121212",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  tabBarActiveTintColor: {
    color: "#EFDFC5",
  },

  tabBarInactiveTintColor: {
    color: "#777",
  },
  
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
});
